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
import { FieldSelect } from 'app/installer/components/Fields';

let fieldCounter = 0;

export default function InterfaceVariable(props) {
  const { defaultValue, onChange, options, ...styles } = props;

  const [ value, setValue ] = React.useState(defaultValue);

  React.useEffect(() => {
    onChange(value);
  }, [ value ])

  // field name for validation context
  const fieldName = React.useMemo(() => {
    return `${++fieldCounter}-interface`;
  }, []);

  // pick up this field title from web config
  const { label, selectOptions } = React.useMemo(() => {
    const ipCfg = cfg.getAgentDeviceIpv4();
    const label = ipCfg.labelText || 'IP Address';

    const selectOptions = options.map(item => ({
      value: item,
      label: item
    }));

    return {
      label,
      selectOptions
    }
  }, []);


  function onChangeSelect(option) {
    setValue(option.value)
  }

  return (
    <FieldSelect
      {...styles}
      value={value}
      name={fieldName}
      rule={required(`${label} is required`)}
      label={label}
      value={{ value, label: value }}
      options={selectOptions}
      onChange={onChangeSelect}
    />
  )
}

const required = errorText => option => () => {
  if (!option || !option.value) {
    return errorText;
  }
}