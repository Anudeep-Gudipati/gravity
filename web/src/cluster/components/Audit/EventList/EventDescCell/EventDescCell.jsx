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
import cfg from 'app/config';
import { Cell } from  'shared/components/DataTable';
import  { ButtonPrimary } from 'shared/components/Button';
import { CodeEnum } from 'app/cluster/services/events/event';

function getDescription({code, message, details}){
  switch(code){
    case CodeEnum.SESSION_END:
      const { sid } = details;
      const url = cfg.getConsolePlayerRoute({ sid });
      return (
        <>
          <ButtonPrimary mr="2" size="small" as="a" href={url} target="_blank">
            Play
          </ButtonPrimary>
          {message}
        </>
      );
  }

  return message;
}

export default function TypeCell({ rowIndex, data }){
  const desc = getDescription(data[rowIndex]);
  return (
    <Cell>
      {desc}
    </Cell>
  )
}