import React from 'react'
import { storiesOf } from '@storybook/react'
import { AuthConnectors } from './AuthConnectors'
import { AuthStoreRec } from 'e-app/cluster/flux/authConnectors/authStore';
import { AccessListRec } from 'oss-app/flux/userAcl/store';

storiesOf('Gravity/AuthConnectors', module)
  .add('AuthConnectors', () => {
    const store = new AuthStoreRec().setItems(json.items);
    const userAclStore = new AccessListRec(defaultAcl);
    return (
      <AuthConnectors
        saveAttempt={{}}
        store={store}
        userAclStore={userAclStore}
        />
    );
  })
  .add('Empty', () => {
    const userAclStore = new AccessListRec(defaultAcl);
    return (
      <AuthConnectors
        saveAttempt={{}}
        store={new AuthStoreRec()}
        userAclStore={userAclStore}
        />
    );
  });

const defaultAcl = {
  authConnectors: {
    connect: true,
    list: true,
    read: true,
    edit: true,
    create: true,
  }
}

const json = {
  "items": [{
    "id": "oidc:googleZufuban",
    "kind": "saml",
    "name": "Okta",
    "displayName": "Okta",
    "content": "kind: oidc\nmetadata:\n  name: google\nspec:\n  claims_to_roles:\n  - claim: hd\n    roles:\n    - '@teleadmin'\n    value: gravitational.com\n  - claim: hd\n    roles:\n    - '@teleadmin'\n    value: gravitational.io\n  client_id: 529920086732-v30abileumfve0vhjtasn7l0k5cqt3p7.apps.googleusercontent.com\n  client_secret: k1NZ2WiB0VjVEpf-XInlHkCz\n  display: Google\n  issuer_url: https://accounts.google.com\n  redirect_url: https://demo.gravitational.io:443/portalapi/v1/oidc/callback\n  scope:\n  - email\nversion: v2\n"
  },
  {
    "id": "oidc:googleGogesu",
    "kind": "oidc",
    "name": "google",
    "displayName": "google",
    "content": "kind: oidc\nmetadata:\n  name: google\nspec:\n  claims_to_roles:\n  - claim: hd\n    roles:\n    - '@teleadmin'\n    value: gravitational.com\n  - claim: hd\n    roles:\n    - '@teleadmin'\n    value: gravitational.io\n  client_id: 529920086732-v30abileumfve0vhjtasn7l0k5cqt3p7.apps.googleusercontent.com\n  client_secret: k1NZ2WiB0VjVEpf-XInlHkCz\n  display: Google\n  issuer_url: https://accounts.google.com\n  redirect_url: https://demo.gravitational.io:443/portalapi/v1/oidc/callback\n  scope:\n  - email\nversion: v2\n"
  },
  {
    "id": "oidc:googlePetizu",
    "kind": "github",
    "name": "github",
    "displayName": "Github",
    "content": "kind: oidc\nmetadata:\n  name: google\nspec:\n  claims_to_roles:\n  - claim: hd\n    roles:\n    - '@teleadmin'\n    value: gravitational.com\n  - claim: hd\n    roles:\n    - '@teleadmin'\n    value: gravitational.io\n  client_id: 529920086732-v30abileumfve0vhjtasn7l0k5cqt3p7.apps.googleusercontent.com\n  client_secret: k1NZ2WiB0VjVEpf-XInlHkCz\n  display: Google\n  issuer_url: https://accounts.google.com\n  redirect_url: https://demo.gravitational.io:443/portalapi/v1/oidc/callback\n  scope:\n  - email\nversion: v2\n"
  }]
}