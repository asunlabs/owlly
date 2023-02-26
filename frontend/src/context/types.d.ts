export type TypeSignUp = 'email' | 'wallet';
export type TypeToastStatus = 'success' | 'failure';
export type TypeModalType = 'email' | 'wallet';
export type TypeData = string | undefined;

export interface ISlackContextProvider {
  children?: React.ReactNode;
}

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

export interface IWailsResponse {
  Code: string;
  Message: string;
  Data?: string;
}

export interface IModalProps {
  modalType: TypeModalType;
}

export type TypeResponse = {
  Code: string;
  Message: string;
  Data: TypeData;
};

export interface IWailsResponseContextProps {
  response: TypeResponse;
  setResponse: (prev: React.SetStateAction<TypeResponse>) => void;
}

export interface IWailsResponseContextProviderProps {
  children: React.ReactNode;
}

export interface IListProps {
  toggle?: boolean;
}

export interface IButtonProps {
  isDynamic?: boolean;
  transparent?: boolean;
}

export interface IActionAreaCardProps {
  src?: string;
  title?: string;
  description?: string;
}

export interface IIsLaunchProps {
  disable: boolean;
  launch: boolean;
}

export interface ITitleProps {
  isHome?: boolean;
}
