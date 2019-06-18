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
import { Box, ButtonSso } from 'shared/components';
import { guessProviderType } from 'shared/components/ButtonSso/utils';

const SsoBtnList = ({providers, prefixText, isDisabled, onClick}) => {
  const $btns = providers.map((item, index) => {
    let { name, type, displayName } = item;
    displayName = displayName || name;
    const title = `${prefixText} ${displayName}`
    const ssoType = guessProviderType(displayName, type);
    return (
      <ButtonSso key={index}
        ssoType={ssoType}
        mt={5}
        disabled={isDisabled}
        onClick={e => { e.preventDefault(); onClick(item) }}>
        {title}
      </ButtonSso>
    )
  })

  if ($btns.length === 0) {
    return (
      <h4> You have no SSO providers configured </h4>
    )
  }

  return  (
    <Box px={6} pt={2} pb={5}>
      {$btns}
    </Box>
  )
}

export default SsoBtnList;
