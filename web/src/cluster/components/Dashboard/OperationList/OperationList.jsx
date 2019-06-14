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

import React from 'react';
import $ from 'jquery';
import { keyBy } from 'lodash';
import { TablePaged, Column, Cell } from 'shared/components/DataTable';
import { Flex, Text, Box } from 'shared/components';
import { withState } from 'shared/hooks';
import { useFluxStore } from 'app/components/nuclear';
import { getters as operationGetters } from 'app/cluster/flux/operations';
import { fetchOps, fetchOpProgress } from 'app/cluster/flux/operations/actions';
import { getters as sessionGetters } from 'app/cluster/flux/sessions';
import { getters as nodeGetters } from 'app/cluster/flux/nodes';
import { fetchActiveSessions } from 'app/cluster/flux/sessions/actions';
import AjaxPoller from 'app/components/dataProviders'
import TypeCell from './TypeCell';
import UserCell from './UserCell';
import ActionCell from './ActionCell';
import CreatedCell from './CreatedCell';
import DescCell from './DescCell';

const POLL_INTERVAL = 5000; // every 5 sec

export function OperationList(props){
  const { sessions, progress, nodes, operations, pageSize=3, onFetchProgress, onRefresh, ...rest } = props;

  const dataOps = operations.map(o => ({
      isSession: false,
      operation: o,
    }));

  const dataSessions = sessions.map(s => ({
      isSession: true,
      session: s,
    }));

  const data = [
    // show terminal sessions first
    ...dataSessions,
    ...dataOps
  ]

  return (
    <Box {...rest}>
      <AjaxPoller time={POLL_INTERVAL} onFetch={onRefresh} />
      <Flex bg="primary.light" p="3" alignItems="center">
        <Text typography="h4">
          Operations
        </Text>
      </Flex>
      <TablePaged rowCount={data.length} data={data} pageSize={pageSize} pagerPosition="bottom">
        <Column
          operations={operations}
          progress={progress}
          header={
            <Cell>Type</Cell>
          }
          cell={<TypeCell/> }
        />
        <Column
          nodes={nodes}
          operations={operations}
          progress={progress}
          onFetchProgress={onFetchProgress}
          columnKey="description"
          header={
            <Cell>Description</Cell>
          }
          cell={<DescCell/> }
        />
        <Column
          operations={operations}
          progress={progress}
          columnKey="createdBy"
          header={
            <Cell>User</Cell>
          }
          cell={<UserCell/> }
        />
        <Column
          operations={operations}
          progress={progress}
          header={ <Cell>Created</Cell> }
          cell={<CreatedCell/> }
        />
        <Column
          operations={operations}
          progress={progress}
          header={<Cell /> }
          cell={<ActionCell /> }
        />
      </TablePaged>
    </Box>
  )
}

function mapState(){
  const opsStore = useFluxStore(operationGetters.operationStore);
  const sessionStore = useFluxStore(sessionGetters.sessionStore);
  const nodeStore = useFluxStore(nodeGetters.nodeStore);

  function onRefresh(){
    return $.when(fetchOps(), fetchActiveSessions());
  }

  const nodes = keyBy(nodeStore.nodes, 'id');

  return {
    sessions: sessionStore.sessions,
    operations: opsStore.operations,
    progress: opsStore.progress,
    nodes,
    onRefresh,
    onFetchProgress: id => fetchOpProgress(id),
  }
}

export default withState(mapState)(OperationList);