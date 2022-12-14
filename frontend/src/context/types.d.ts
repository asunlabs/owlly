export interface ISlackContextProvider {
  children?: React.ReactNode;
}

// TODO fix slack context type error
export interface ISlackConfigProps {
  triggerName: string;
  botOauthToken: string;
  channelID: string;
  userID: string;
  userName: string;
}

export interface ISignerInfoProps {
  address: string;
  balance: string;
  network: string;
  isActive: boolean;
  isLogin: boolean;
}

export interface ISiweProps {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
}

export interface ILayoutProps {
  children?: React.ReactNode;
}

export interface IDropdownProps {
  account: boolean;
  bot: boolean;
  help: boolean;
}
