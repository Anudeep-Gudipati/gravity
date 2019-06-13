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

import reactor from 'app/reactor';
import auth from 'app/services/auth';
import cfg from 'app/config';
import api from 'app/services/api';
import Logger from 'app/lib/logger';
import history from 'app/services/history';
import { USER_RECEIVE } from './actionTypes';
import { USERACL_RECEIVE } from './../userAcl/actionTypes';

const logger = Logger.create('user/actions');

export function login(userId, password, token) {
  const promise = auth.login(userId, password, token);
  return _handleLoginPromise(promise);
}

export function loginWithU2f(userId, password) {
  const promise = auth.loginWithU2f(userId, password);
  return _handleLoginPromise(promise);
}

export function loginWithSso(providerName, redirectUrl) {
  const appStartRoute = getEntryRoute();
  const ssoUri = cfg.getSsoUrl(redirectUrl, providerName, appStartRoute);
  history.push(ssoUri, true);
}

export function fetchUserContext(){
  return api.get(cfg.getSiteUserContextUrl()).done(json => {
    cfg.setServerVersion(json.serverVersion);
    reactor.dispatch(USER_RECEIVE, json.user);
    reactor.dispatch(USERACL_RECEIVE, json.userAcl);
  });
}

export function changePassword(oldPsw, newPsw, token){
  const data = {
    'old_password': window.btoa(oldPsw),
    'new_password': window.btoa(newPsw),
    'second_factor_token': token
  }

  return api.put(cfg.getSiteChangePasswordUrl(), data);
}

function getEntryRoute() {
  const entryUrl = history.getRedirectParam();
  return !entryUrl ? cfg.routes.app : entryUrl;
}

function _handleLoginPromise(promise) {
  return promise.done(() => {
    const redirect = getEntryRoute();
    const withPageRefresh = true;
    history.push(redirect, withPageRefresh);
  })
  .fail(err => {
    logger.error('login', err);
  });
}