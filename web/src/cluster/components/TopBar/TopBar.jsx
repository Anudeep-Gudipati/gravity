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
import { NavLink } from 'react-router-dom';
import { useFluxStore } from 'app/components/nuclear';
import { withState } from 'shared/hooks';
import userGetters from 'app/flux/user/getters';
import { getters as navGetters } from 'app/cluster/flux/nav';
import { getters as infoGetters } from 'app/cluster/flux/info';
import { fetchSiteInfo, changeRemoteAccess } from 'app/cluster/flux/info/actions';
import AjaxPoller from 'app/components/dataProviders'
import session from 'app/services/session';
import TopNavUserMenu from 'shared/components/TopNav/TopNavUserMenu'
import { Flex, Text, ButtonOutlined, ButtonPrimary, TopNav } from 'shared/components';
import { MenuItemIcon, MenuItem } from 'shared/components/Menu/';
import ClusterStatus from './ClusterStatus';
import InfoDialog from './ClusterInfoDialog';
import RemoteAccess from './RemoteAccess';

const POLLING_INTERVAL = 5000; // every 5 sec

export class TopBar extends React.Component {

  state = {
    open: false,
    infoDialogOpen: false,
  };

  onShowInfoDialog = () => {
    this.setState({infoDialogOpen: true})
  }

  onCloseInfoDialog = () => {
    this.setState({infoDialogOpen: false})
  }

  onShowMenu = () => {
    this.setState({ open: true });
  };

  onCloseMenu = () => {
    this.setState({ open: false });
  };

  onItemClick = () => {
    this.onClose();
  }

  onLogout = () => {
    this.onCloseMenu();
    this.props.onLogout();
  }

  menuItemProps = {
    onClick: this.onCloseMenu,
    py: 2,
    as: NavLink,
    exact: true
  }

  render() {
    const { user, infoStore, onRefresh, navStore, pl, onChangeRemoteAccess } = this.props;
    const { open, infoDialogOpen } = this.state;
    const username = user.userId;
    const { status, remoteAccess, commands, publicUrls, internalUrls } = infoStore;
    const clusterPublicUrl = publicUrls[0];
    const tshLogin = commands.tshLogin;

    const $items = navStore.topNav.map( (item, index) => (
      <MenuItem {...this.menuItemProps} key={index} to={item.to}>
        <MenuItemIcon as={item.Icon} mr="2" />
          {item.title}
      </MenuItem>
    ))

    return (
      <TopNav pl={pl} height="72px" bg="transparent">
        <Flex alignItems="center">
          <ClusterStatus value={status} />
          <Text mx="3" typography="body2" color="text.primary">
            {clusterPublicUrl}
          </Text>
        </Flex>
        <ButtonOutlined width="120px" size="small" onClick={this.onShowInfoDialog}>
          View Info
        </ButtonOutlined>
        <Flex ml="auto" height="100%">
          <RemoteAccess remoteAccess={remoteAccess} onChange={onChangeRemoteAccess} />
          <TopNavUserMenu
            menuListCss={menuListCss}
            open={open}
            onShow={this.onShowMenu}
            onClose={this.onCloseMenu}
            user={username}>
            {$items}
            <MenuItem>
              <ButtonPrimary my={3} block onClick={this.onLogout}>
                Sign Out
              </ButtonPrimary>
            </MenuItem>
          </TopNavUserMenu>
          { infoDialogOpen && (
            <InfoDialog
              cmd={tshLogin}
              publicUrls={publicUrls}
              internalUrls={internalUrls}
              onClose={this.onCloseInfoDialog}/>
          )}
        </Flex>
        <AjaxPoller time={POLLING_INTERVAL} onFetch={onRefresh} />
      </TopNav>
    )
  }
}

const menuListCss = () => `
  width: 250px;
`

function mapState() {
  const user = useFluxStore(userGetters.user);
  const navStore = useFluxStore(navGetters.navStore);
  const infoStore = useFluxStore(infoGetters.infoStore);
  return {
    user,
    navStore,
    infoStore,
    onLogout: () => session.logout(),
    onRefresh: fetchSiteInfo,
    onChangeRemoteAccess: changeRemoteAccess
  }
}

export default withState(mapState)(TopBar);