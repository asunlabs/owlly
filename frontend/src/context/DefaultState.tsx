import { ISiweProps } from './types.d';

export const breakpoints = {
  device: {
    mobile: {
      small: '320px',
      medium: '375px',
      large: '425px',
    },
    tablet: '768px',
    laptop: {
      default: '1024px',
      large: '1440px',
    },
    desktop: '2560px',
  },
};

// @dev state should synced with config/setup.go
export const EVENT_SLACK = {
  update: 'SLACK_UPDATE_EVENT',
  delete: 'SLACK_DELETE_EVENT',
};

export const EVENT_AUTH = {
  signUp: 'AUTH_SIGN_UP_EVENT',
  signIn: 'AUTH_SIGN_IN_EVENT',
  logout: 'AUTH_LOGOUT_EVENT',
};

export const NETWORK_ID = {
  goerli: 5,
};

// TODO fix config later
export const SIWE_MESSAGE_PROPS: ISiweProps = {
  domain: 'Owlly ver 0.3.2' || window.location.host,
  address: '0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4',
  statement: 'Owlly: Sign in with Ethereum',
  uri: 'developerasun' || window.location.origin,
  version: '1',
  chainId: NETWORK_ID.goerli,
};
