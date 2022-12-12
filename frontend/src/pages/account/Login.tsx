import { Button } from '@owlly/components/Button';
import * as React from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

export interface ISignerInfoProps {
  address: string;
  balance: string;
  network: string;
  isActive: boolean;
  isLogin: boolean;
}

function getSiweSetup() {
  const domain = window.location.host;
  const origin = window.location.origin;

  const _window = window as any;
  const ethereum = _window.ethereum;

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  return {
    domain,
    origin,
    ethereum,
    provider,
    signer,
  };
}

function createSiweMessage(address: string, statement: string) {
  const { domain, origin } = getSiweSetup();
  const _message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1', // @dev current message version
    chainId: 5, // goerli
  });

  // @dev Returns a message ready to be signed according with the type defined in the object.
  const message = _message.prepareMessage();
  return { message };
}

async function connectWallet(callback: React.Dispatch<React.SetStateAction<ISignerInfoProps>>) {
  try {
    const { provider, signer } = getSiweSetup();
    const accountArray = await provider.send('eth_requestAccounts', []);

    if (accountArray[0] === (await signer.getAddress()).toLowerCase()) {
      callback({
        address: await signer.getAddress(),
        balance: (await signer.getBalance()).toString(),
        network: provider.network.name,
        isActive: true,
        isLogin: false,
      });
      return true;
    }
  } catch (err) {
    console.log(err);
  }
}

async function signInWithEthereum(callback: React.Dispatch<React.SetStateAction<ISignerInfoProps>>) {
  // get user consent for metamask connection
  const { signer } = getSiweSetup();
  const ok = await connectWallet(callback);

  if (ok) {
    const { message } = createSiweMessage(await signer.getAddress(), 'Owlly: Sign in with Ethereum');

    // get user consent for login
    await signer.signMessage(message);

    // make signer login status true
    callback((prev) => ({
      ...prev,
      isLogin: true,
    }));
  }
}

export function Login() {
  const [signerInfo, setSignerInfo] = React.useState<ISignerInfoProps>({
    address: '',
    balance: '0',
    network: '',
    isActive: false,
    isLogin: false,
  });

  return (
    <div>
      profile here
      <p>address: {signerInfo.address}</p>
      <p>balance: {JSON.stringify(signerInfo.balance)}</p>
      <p>
        network:
        {signerInfo.network.length !== 0 ? signerInfo.network : 'No connection'}
      </p>
      <p>{signerInfo.isLogin ? 'you can see hidden info after sign-in' : ''}</p>
      <Button onClick={async () => await signInWithEthereum(setSignerInfo)}>Sign in with Ethereum</Button>
    </div>
  );
}
