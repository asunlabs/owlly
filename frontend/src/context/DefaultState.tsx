import * as React from 'react';

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

export interface ISlackContextProvider {
  children?: React.ReactNode;
}

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

export const EVENT_SLACK = {
  update: 'SLACK_UPDATE_EVENT',
  delete: 'SLACK_DELETE_EVENT',
};
