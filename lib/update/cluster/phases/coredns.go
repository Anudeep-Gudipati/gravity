/*
Copyright 2018 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package phases

import (
	"context"

	"github.com/gravitational/gravity/lib/fsm"

	"github.com/gravitational/rigging"
	"github.com/gravitational/trace"
	log "github.com/sirupsen/logrus"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

const (
	CoreDNSResourceName = "gravity:coredns"
)

type updatePhaseCoreDNS struct {
	kubernetesOperation
}

// NewPhaseCoreDNS creates an upgrade phase to add coredns rbac permissions
// The normal upgrade sequence is to Rolling update planet, then to update our RBAC settings in the RBAC app
// However, CoreDNS within planet needs these settings to function, so these settings specifically need to be created
// before the rolling restart of planet
func NewPhaseCoreDNS(p fsm.ExecutorParams, client *kubernetes.Clientset, logger log.FieldLogger) (*updatePhaseCoreDNS, error) {
	op, err := newKubernetesOperation(p, client, logger)
	if err != nil {
		return nil, trace.Wrap(err)
	}
	return &updatePhaseCoreDNS{
		kubernetesOperation: *op,
	}, nil
}

// Execute will add rbac permissions for coredns to sync cluster information
func (p *updatePhaseCoreDNS) Execute(ctx context.Context) error {
	_, err := p.kubernetesOperation.Client.RbacV1().ClusterRoles().Create(&rbacv1.ClusterRole{
		ObjectMeta: metav1.ObjectMeta{Name: CoreDNSResourceName},
		Rules: []rbacv1.PolicyRule{
			{
				APIGroups: []string{""},
				Verbs:     []string{"list", "watch"},
				Resources: []string{"endpoints", "services", "namespaces"},
			},
		},
	})
	err = rigging.ConvertError(err)
	if err != nil {
		if trace.IsAlreadyExists(err) {
			p.Infof("ClusterRoles/%v already exists, skiping...", CoreDNSResourceName)
		} else {
			return trace.Wrap(err)
		}
	} else {
		p.Infof("ClusterRole/%v created.", CoreDNSResourceName)
	}

	_, err = p.kubernetesOperation.Client.RbacV1().ClusterRoleBindings().Create(&rbacv1.ClusterRoleBinding{
		ObjectMeta: metav1.ObjectMeta{Name: CoreDNSResourceName},
		RoleRef: rbacv1.RoleRef{
			APIGroup: "rbac.authorization.k8s.io",
			Kind:     "ClusterRole",
			Name:     CoreDNSResourceName,
		},
		Subjects: []rbacv1.Subject{
			{
				Kind:     "User",
				Name:     "coredns",
				APIGroup: "rbac.authorization.k8s.io",
			},
		},
	})
	err = rigging.ConvertError(err)
	if err != nil {
		if trace.IsAlreadyExists(err) {
			p.Infof("ClusterRoleBinding/%v already exists, skiping...", CoreDNSResourceName)
		} else {
			return trace.Wrap(err)
		}
	} else {
		p.Infof("ClusterRoleBinding/%v created.", CoreDNSResourceName)
	}

	return nil
}

// Rollback - Noop (don't worry about deleting resources during a rollback, they'll just be unused)
func (p *updatePhaseCoreDNS) Rollback(context.Context) error {
	return nil
}
