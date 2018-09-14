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

package keyval

import (
	"context"
	"time"

	etcd "github.com/coreos/etcd/client"
	"github.com/gravitational/gravity/lib/storage"
)

type electingBackend struct {
	storage.Backend
	storage.Leader
	client etcd.Client
}

// AddWatch starts watching the key for changes and sending them
// to the valuesC
func (b *electingBackend) AddWatch(key string, retry time.Duration, valuesC chan string) {
	b.Leader.AddWatch(key, retry, valuesC)
}

// AddVoter adds a voter that tries to elect given value
// by attempting to set the key to the value for a given term duration
// it also attempts to hold the lease indefinitely
func (b *electingBackend) AddVoter(ctx context.Context, key, value string, term time.Duration) error {
	return b.Leader.AddVoter(ctx, key, value, term)
}

// StepDown tells the voter to pause election so it can give up its leadership
func (b *electingBackend) StepDown() {
	b.Leader.StepDown()
}

// api returns etcd API client used by tests
func (b *electingBackend) api() etcd.KeysAPI {
	return etcd.NewKeysAPI(b.client)
}
