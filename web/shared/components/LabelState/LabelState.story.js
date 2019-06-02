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
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import LabelState from './LabelState';
import Flex from './../Flex';

storiesOf('LabelState', module)
  .addDecorator(withInfo)
  .add('kinds', () => (
    <Flex height="100px" bg="primary.main" justifyContent="center" alignItems="center">
      <LabelState mr="4" kind="primary">Primary</LabelState>
      <LabelState mr="4" kind="secondary">Secondary</LabelState>
      <LabelState mr="4" kind="warning">Warning</LabelState>
      <LabelState mr="4" kind="danger">Danger</LabelState>
    </Flex>
  ))
