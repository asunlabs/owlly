import * as React from 'react';
import {
  ISlackContextProvider,
  TypeResponse,
  IWailsResponseContextProps,
  IWailsResponseContextProviderProps,
} from './types.d';

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

export const WailsResponseContext = React.createContext<IWailsResponseContextProps>({
  // initial state
  response: {
    Code: '',
    Message: '',
    Data: '',
  },

  // state setter
  setResponse: (prev: React.SetStateAction<TypeResponse>) => {},
});

export function WailsResponseContextProvider({ children }: IWailsResponseContextProviderProps) {
  const [response, setResponse] = React.useState<TypeResponse>({
    Code: '',
    Message: '',
    Data: '',
  });

  const value = { response, setResponse };

  return <WailsResponseContext.Provider value={value}>{children}</WailsResponseContext.Provider>;
}
