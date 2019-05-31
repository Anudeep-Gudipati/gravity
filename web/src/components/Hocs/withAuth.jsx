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
import session from 'app/services/session';
import history from 'app/services/history';
import Logger from 'app/lib/logger';
import { fetchUserContext } from 'app/flux/user/actions';

const logger = Logger.create('/components/withAuth');

const withAuth = component => {

  return class AuthWrapper extends React.Component{

    static displayName = `AuthWrapper`

    state = {
      hasUser: false,
    }

    componentDidMount() {
      if(!session.isValid()){
        logger.warn("invalid session");
        const rememberLocation = true;
        history.goToLogin(rememberLocation)
        return;
      }

      // keeps the session alive
      session.ensureSession();

      fetchUserContext().then(() => {
        this.setState({ hasUser: true });
      })
      .fail(err => {
        logger.error(err)
      })
    }

    render() {
      if (this.state.hasUser) {
        return React.createElement(component, this.props);
      }

      return null;
    }
  }
}

export default withAuth;