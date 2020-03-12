/*
Copyright 2020 Gravitational, Inc.

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

package opsservice

import (
	"strings"
	"time"

	"github.com/gravitational/gravity/lib/defaults"
	"github.com/gravitational/gravity/lib/loc"
	"github.com/gravitational/gravity/lib/pack"

	"github.com/coreos/go-semver/semver"
	"gopkg.in/check.v1"
)

type VersionsSuite struct {
	packages pack.PackageService
}

var _ = check.Suite(&VersionsSuite{})

func (s *VersionsSuite) SetUpTest(c *check.C) {
	services := SetupTestServices(c)
	s.packages = services.Packages
	// Create an intermediate runtime package.
	err := s.packages.UpsertRepository(defaults.SystemAccountOrg, time.Time{})
	c.Assert(err, check.IsNil)
	_, err = s.packages.CreatePackage(
		loc.Runtime.WithLiteralVersion("2.0.15"),
		strings.NewReader(""),
		pack.WithLabels(pack.RuntimeUpgradeLabels("2.0.15")))
	c.Assert(err, check.IsNil)
}

func (s *VersionsSuite) TestVersions(c *check.C) {
	currentRuntime := loc.Runtime.WithLiteralVersion("3.0.5")
	tests := []struct {
		fromRuntime loc.Locator
		unsupported bool
	}{
		{
			fromRuntime: loc.Runtime.WithLiteralVersion("2.0.5"),
		},
		{
			fromRuntime: loc.Runtime.WithLiteralVersion("3.0.1"),
		},
		{
			fromRuntime: loc.Runtime.WithLiteralVersion("1.0.0"),
		},
		{
			fromRuntime: loc.Runtime.WithLiteralVersion("0.0.1"),
			unsupported: true,
		},
	}
	for _, test := range tests {
		err := checkRuntimeUpgradePath(checkRuntimeUpgradePathRequest{
			FromRuntime:           test.fromRuntime,
			ToRuntime:             currentRuntime,
			DirectUpgradeVersions: directUpgradeVersions,
			UpgradeViaVersions:    upgradeViaVersions,
			Packages:              s.packages,
		})
		if test.unsupported {
			c.Assert(err, check.NotNil)
		} else {
			c.Assert(err, check.IsNil)
		}
	}
}

var (
	directUpgradeVersions = Versions{
		semver.New("2.0.0"),
		semver.New("3.0.0"),
	}
	upgradeViaVersions = map[*semver.Version]Versions{
		semver.New("1.0.0"): Versions{semver.New("2.0.10")},
	}
)
