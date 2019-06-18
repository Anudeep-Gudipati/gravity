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
import { NavLink } from 'app/components/Router';
import { K8sPodDisplayStatusEnum } from 'app/services/enums'
import { Cell } from 'shared/components/DataTable';
import { Flex, Label } from 'shared/components';
import * as States from 'shared/components/LabelState';
import { useK8sContext } from '../../k8sContext';
import ResourceActionCell, { MenuItem } from './../../components/ResourceActionCell';
import ContainerMenu from './ContainerMenu';

export function NameCell({ rowIndex, data }){
  const { name } = data[rowIndex];
  return (
    <Cell>
      {name}
    </Cell>
  )
}

export function ActionCell({ rowIndex, data }) {
  const { podMonitorUrl, podLogUrl } = data[rowIndex];
  const { monitoringEnabled = false } = useK8sContext();
  return (
    <ResourceActionCell rowIndex={rowIndex} data={data} >
      {monitoringEnabled && (
        <MenuItem as={NavLink} to={podMonitorUrl} >
          Monitoring
        </MenuItem>
      )}
      <MenuItem as={NavLink} to={podLogUrl} >
        Logs
      </MenuItem>
    </ResourceActionCell>
  )
}

export function StatusCell({ rowIndex, data }){
  const { status, statusDisplay } = data[rowIndex];
  let StateLabel = States.StateSuccess;
  switch(status){
    case K8sPodDisplayStatusEnum.RUNNING:
      StateLabel = States.StateSuccess;
      break;
    case K8sPodDisplayStatusEnum.PENDING:
    case K8sPodDisplayStatusEnum.TERMINATED:
    case K8sPodDisplayStatusEnum.FAILED:
      StateLabel = States.StateDanger;
      break;
  }

  return (
    <Cell>
      <StateLabel>{statusDisplay}</StateLabel>
    </Cell>
  )
}

export function ContainerCell({ rowIndex, data, sshLogins }){
  const { containers, name: pod, podHostIp, namespace } = data[rowIndex];
  const $containers = containers.map(item => {
    const { name, logUrl } = item;
    const container = {
      name,
      logUrl,
      pod,
      serverId: podHostIp,
      namespace,
      sshLogins
    };

    return (
      <ContainerMenu mr="2" key={item.name} container={container} />
    )
  });

  return (
    <Cell>
      <Flex flexDirection="row">
        {$containers}
      </Flex>
    </Cell>
  )
}

export function LabelCell({ rowIndex, data }){
  const { labelsText } = data[rowIndex];
  const $labels = labelsText.map((item, key) => (
    <Label mb="1" mr="1" key={key} kind="secondary">
      {item}
    </Label>
  ))

  return (
    <Cell>
      {$labels}
    </Cell>
  )
}