import React from 'react';
import { FluxContext } from 'oss-app/components/nuclear';
import { withState } from 'shared/hooks';
import { getters as navGetters } from 'e-app/hub/flux/nav';
import SideNavLayout from '../components/SideNavLayout';

function mapState() {
  const reactor = React.useContext(FluxContext);
  const navStore = reactor.evaluate(navGetters.navStore);
  return {
    navItems: navStore.settings,
  }
}

export default withState(mapState)(SideNavLayout);