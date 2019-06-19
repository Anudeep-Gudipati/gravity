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

import api from 'app/services/api';
import cfg from 'app/config';
import { generatePath } from 'react-router';
import { makeNodes } from './makeK8sNode';

const k8s = {

  getNamespaces(){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sNamespacePath, {siteId});
    return api.get(url).then( json => json.items );
  },

  saveConfigMap(namespace, name, data){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(
      cfg.api.k8sConfigMapsByNamespacePath,
      {siteId, namespace, name}
    );

    return api.patch(url, data);
  },

  getConfigMaps(){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sConfigMapsPath, {siteId});
    return api.get(url).then( json => json.items );
  },

  getNodes(){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sNodesPath, {siteId});
    return api.get(url).then(json => makeNodes(json.items));
  },

  getJobs(namespace){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sJobsPath, {siteId, namespace});
    return api.get(url).then( json => json.items );
  },

  getPods(namespace){
    const siteId = cfg.defaultSiteId;
    let url = cfg.api.k8sPodsPath;
    if(namespace){
      url = cfg.api.k8sPodsByNamespacePath;
    }

    url = generatePath(url, {siteId, namespace});
    return api.get(url).then( json => json.items );
  },

  getServices(){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sServicesPath, {siteId});
    return api.get(url).then( json => json.items );
  },

  getDeployments(){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sDelploymentsPath, {siteId});
    return api.get(url).then( json => json.items );
  },

  getDaemonSets(){
    const siteId = cfg.defaultSiteId;
    const url = generatePath(cfg.api.k8sDaemonSetsPath, {siteId});
    return api.get(url).then( json => json.items );
  }
}

export default k8s;