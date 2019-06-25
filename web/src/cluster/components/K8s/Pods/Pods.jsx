/*
Copyright 2019 Gravitational, Inc.

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

import React, { useState } from 'react';
import { useFluxStore } from 'app/components/nuclear';
import { withState } from 'shared/hooks';
import { useK8sContext } from './../k8sContext';
import Poller from './../components/Poller';
import { fetchPods } from 'app/cluster/flux/k8sPods/actions';
import { getters as aclGetters } from 'app/flux/userAcl';
import { Box } from 'shared/components';
import InputSearch from 'app/cluster/components/components/InputSearch';
import { getters } from 'app/cluster/flux/k8sPods';
import PodList from './PodList/PodList';

export function Pods(props) {
  const { namespace, podInfos, userAcl, onFetch } = props;
  const [searchValue, onSearchChange ] = useState('');
  const sshLogins = userAcl.getSshLogins();

  return (
    <React.Fragment>
      <Poller namespace={namespace} onFetch={onFetch} />
      <Box bg="primary.light" p="3" borderTopLeftRadius="3" borderTopRightRadius="3">
        <InputSearch autoFocus onChange={onSearchChange}/>
      </Box>
      <PodList
        podInfos={podInfos}
        searchValue={searchValue}
        namespace={namespace}
        sshLogins={sshLogins}
      />
    </React.Fragment>
  )
}

export default withState(() => {
  const { namespace } = useK8sContext();
  const podInfos = useFluxStore(getters.podInfoList);
  const userAcl =  useFluxStore(aclGetters.userAcl);
  return {
    userAcl,
    namespace,
    podInfos,
    onFetch: fetchPods,
  }
})(Pods);
