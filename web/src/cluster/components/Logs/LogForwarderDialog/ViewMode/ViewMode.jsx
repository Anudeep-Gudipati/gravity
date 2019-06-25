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

import React from 'react'
import { DialogFooter, DialogTitle } from 'shared/components/Dialog';
import { ButtonPrimary, ButtonWarning, ButtonSecondary, Flex, Box, LabelInput } from 'shared/components';
import TextEditor from 'app/components/TextEditor';
import * as Alerts from 'shared/components/Alert';
import { NoteAdded } from 'shared/components/Icon';
import { useAttempt } from 'shared/hooks';
import ItemList from './ItemList';

export default function ViewMode({ curIndex, items, onEdit, onCreate, onSelect, onDelete, onClose, ...styles }){
  const { content } = items[curIndex];
  const [ attempt, attemptActions ] = useAttempt();

  function onDeleteClick() {
    attemptActions.do(() => onDelete(content));
  }

  const { isProcessing } = attempt;
  const { height, width } = styles;

  return (
    <Flex height={height} width={width}>
      <Flex width="280px" bg="primary.light" flexDirection="column">
        <ItemList items={items} curIndex={curIndex} onSelect={onSelect}/>
        <DialogFooter>
          <ButtonSecondary disabled={isProcessing} onClick={onCreate}>
            <NoteAdded fontSize="3" mr="2"/>
              New Forwarder
          </ButtonSecondary>
        </DialogFooter>
      </Flex>
      <Flex flex="1" p="4" flexDirection="column" width="600px" >
        <Flex  mb="4" alignItems="center">
          <DialogTitle > Log Forwarder </DialogTitle>
          <Box ml="auto">
            <ButtonWarning width="80px" size="small" disabled={isProcessing} onClick={onDeleteClick}>
              DELETE
            </ButtonWarning>
          </Box>
        </Flex>
        {attempt.isFailed &&  (
          <Alerts.Danger>
            {attempt.message}
          </Alerts.Danger>
        )}
        <LabelInput>Spec</LabelInput>
        <Flex flex="1">
          <TextEditor readOnly={true} data={content} />
        </Flex>
        <Flex mt="4">
          <ButtonPrimary disabled={isProcessing} onClick={onEdit} mr="2">
            Edit
          </ButtonPrimary>
          <ButtonSecondary ml="auto" disabled={isProcessing} onClick={onClose}>
            Close Log Forwarder Settings
          </ButtonSecondary>
        </Flex>
      </Flex>
    </Flex>
  )
}