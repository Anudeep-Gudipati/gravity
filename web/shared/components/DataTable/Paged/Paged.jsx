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
import { Table } from './../Table';
import Pager from './Pager';
import usePages from './usePages';

export default function PagedTable(props){
  const { pageSize, data, pagerPosition, ...rest } = props;
  const pagedState = usePages({ pageSize, data });

  const tableProps = {
    ...rest,
    data: pagedState.data,
  }

  const showTopPager = !pagerPosition || pagerPosition === 'top';
  const showBottomPager = !pagerPosition || pagerPosition === 'bottom';
  if(showBottomPager && pagedState.hasPages){
    tableProps.borderBottomRightRadius = "0";
    tableProps.borderBottomLeftRadius = "0";
  }

  return (
    <>
      { showTopPager && <Pager borderBottomRightRadius="0" borderBottomLeftRadius="0" {...pagedState}  />}
      <Table {...tableProps} />
      { showBottomPager && <Pager borderTopRightRadius="0" borderTopLeftRadius="0" {...pagedState}  />}
    </>
  )
}