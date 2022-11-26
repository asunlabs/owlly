import * as React from 'react';

export interface ISlackContext {
  triggerName: string;
  botOauthToken: string;
  channelID: string;
  userID: string;
  userName: string;
}

const _slackContext: ISlackContext = {
  triggerName: '',
  botOauthToken: '',
  channelID: '',
  userID: '',
  userName: '',
};

export const slackContext = React.createContext(_slackContext);

export interface ISlackContextProvider {
  children?: React.ReactNode;
}

export function SlackContextProvider({ children }: ISlackContextProvider) {
  return (
    <slackContext.Provider value={_slackContext}>
      {children}
    </slackContext.Provider>
  );
}
