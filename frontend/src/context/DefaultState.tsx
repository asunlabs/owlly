import * as React from 'react';
import { ISlackContextProvider, ISiweProps } from './types.d';

/*
Context list
1. slack config
2. wallet key pair
3. owlly login info
4. dropdown state
*/
export const SlackContext = React.createContext({
  slackContext: {
    triggerName: '',
    botOauthToken: '',
    channelID: '',
    userID: '',
    userName: '',
  },

  // type Dispatch<A> = (value: A) => void;
  setSlackContext: (
    prev: React.SetStateAction<{
      triggerName: string;
      botOauthToken: string;
      channelID: string;
      userID: string;
      userName: string;
    }>
  ) => {},
});

export function SlackContextProvider({ children }: ISlackContextProvider) {
  const [slackContext, setSlackContext] = React.useState({
    triggerName: '',
    botOauthToken: '',
    channelID: '',
    userID: '',
    userName: '',
  });

  const value = { slackContext, setSlackContext };

  // prettier-ignore
  return (
    <SlackContext.Provider value={value}>
      {children}
    </SlackContext.Provider>
  );
}

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

export const NETWORK_ID = {
  goerli: 5,
};

export const SIWE_MESSAGE_PROPS: ISiweProps = {
  domain: 'Owlly ver 0.3.2' || window.location.host,
  address: '0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4',
  statement: 'Owlly: Sign in with Ethereum',
  uri: 'developerasun' || window.location.origin,
  version: '1',
  chainId: NETWORK_ID.goerli,
};
