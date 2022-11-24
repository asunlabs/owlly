import * as React from 'react';

export interface ISlackContext {
  triggerName: string;
  slackBotOauthToken: string;
  slackChannelID: string;
  slackUserID: string;
  slackUserName: string;

  // prettier-ignore
  updateContext: (
    _triggerName: string,
    _slackBotOauthToken: string,
    _slackChannelID: string,
    _slackUserID: string,
    _slackUserName: string,
    ) => void;
}

const _slackContext: ISlackContext = {
  triggerName: '',
  slackBotOauthToken: '',
  slackChannelID: '',
  slackUserID: '',
  slackUserName: '',

  updateContext(
    _triggerName: string,
    _slackBotOauthToken: string,
    _slackChannelID: string,
    _slackUserID: string,
    _slackUserName: string
  ) {
    this.triggerName = _triggerName;
    this.slackBotOauthToken = _slackBotOauthToken;
    this.slackChannelID = _slackChannelID;
    this.slackUserID = _slackUserID;
    this.slackUserName = _slackUserName;
  },
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
