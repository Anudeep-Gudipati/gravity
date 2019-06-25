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
import PropTypes from 'prop-types';
import TextEditor from 'oss-app/components/TextEditor';
import Dialog, { DialogFooter, DialogHeader, DialogTitle, DialogContent} from 'shared/components/Dialog';
import { ButtonSecondary } from 'shared/components';

function EventDetailsDialog(props){
  const { event, onClose } = props;
  const json = JSON.stringify(event.details, null, 2);
  const title = `${event.typeDesc} Event Details`;
  return (
    <Dialog
      dialogCss={dialogCss}
      disableEscapeKeyDown={false}
      onClose={onClose}
      open={true}
      >
      <DialogHeader>
        <DialogTitle typography="body1" caps={true} bold>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <TextEditor readOnly={true} data={json} docType="json" />
      </DialogContent>
      <DialogFooter>
        <ButtonSecondary onClick={onClose}>
          Close
        </ButtonSecondary>
      </DialogFooter>
    </Dialog>
  )
}


EventDetailsDialog.propTypes = {
  event: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

const dialogCss = () => `
  min-height: 400px;
  min-width: 600px;
`

export default EventDetailsDialog;