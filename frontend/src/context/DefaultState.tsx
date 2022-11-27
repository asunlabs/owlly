import * as React from 'react';

export interface ISlackContext {
  triggerName: string;
  botOauthToken: string;
  channelID: string;
  userID: string;
  userName: string;

  // prettier-ignore
  getNewContext: (
    _triggerName: string,
    _botOauthToken: string,
    _channelID: string,
    _userID: string,
    _userName: string
  ) => ISlackContext
}

const _slackContext: ISlackContext = {
  triggerName: '',
  botOauthToken: '',
  channelID: '',
  userID: '',
  userName: '',

  getNewContext(_triggerName: string, _botOauthToken: string, _channelID: string, _userID: string, _userName: string) {
    return {
      triggerName: _triggerName,
      botOauthToken: _botOauthToken,
      channelID: _channelID,
      userID: _userID,
      userName: _userName,
      getNewContext: this.getNewContext,
    };
  },
};

export const slackContext = React.createContext(_slackContext);

export interface ISlackContextProvider {
  children?: React.ReactNode;
}

export function SlackContextProvider({ children }: ISlackContextProvider) {
  return <slackContext.Provider value={_slackContext}>{children}</slackContext.Provider>;
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
