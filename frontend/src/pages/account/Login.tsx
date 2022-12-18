import { Button } from '@owlly/components/Button';
import * as React from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { Form, FormTitle, Input, Label } from '@owlly/components/Form';
import { MdOutlinePassword } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import { NETWORK_ID } from '@owlly/context/DefaultState';
import { ISignerInfoProps } from '@owlly/context/types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

/**
 * @dev domain: SIWE's domain. e.g. window.location.host => 'localhost:5173'
 * @dev origin: SIWE's URI. e.g.window.location.origin =>'http://localhost:5173'
 */
function getSiweSetup() {
  const domain = 'Owlly ver 0.3.1';
  const origin = 'developerasun laptop';

  const _window = window as any;
  const ethereum = _window.ethereum;

  // Web3 provider(metamask) already has a EOA signer in it, requiring Chrome extension to be installed
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

/**
 *
 * @param address a signer's Ethereum address
 * @param statement a message that user will see when signing with SIWE
 * @dev version: current message version
 * @returns message returns a string message in a below format
 * 
    "Owlly ver 0.3.1 wants you to sign in with your Ethereum account:
    \n0xEcAB21327B6EbA1FB0631Dc9bBc5863B6B2be3E4\n
    \nOwlly: Sign in with Ethereum\n
    \nURI: developerasun laptop
    \nVersion: 1
    \nChain ID: 5
    \nNonce: D40vyrk2K1M6DrHSX
    \nIssued At: 2022-12-18T08:43:49.191Z"
 */
function createSiweMessage(address: string, statement: string) {
  const { domain, origin } = getSiweSetup();
  const _message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: NETWORK_ID.goerli,
  });

  // @dev Returns a message ready to be signed according with the type defined in the object.
  const message = _message.prepareMessage();
  return { message };
}

// TODO replace metamask account set => owlly account set
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

function EmailLogin() {
  return (
    <div>
      <FormTitle>Login with Email</FormTitle>
      <Form>
        <Label htmlFor="email">
          <AiOutlineMail />
          <Input id="email" type={'email'} placeholder={'Email'} />
        </Label>
        <Label htmlFor="password">
          <MdOutlinePassword />
          <Input id="password" type={'password'} placeholder={'Password'} />
        </Label>

        <Button type={'button'} id={'sign-up'}>
          Sign up
        </Button>
        <Button type={'button'} id={'sign-in'}>
          Sign in
        </Button>
      </Form>
    </div>
  );
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
    <>
      {/* TODO React-tabs CSS */}
      {/* TODO SIWE signer context persist */}
      <Tabs>
        <TabList>
          <Tab>Sign in with Email</Tab>
          <Tab>Sign in with Ethereum</Tab>
        </TabList>

        <TabPanel>
          <EmailLogin />
        </TabPanel>
        <TabPanel>
          <p>address: {signerInfo.address}</p>
          <p>balance: {JSON.stringify(signerInfo.balance)}</p>
          <p>
            network:
            {signerInfo.network.length !== 0 ? signerInfo.network : 'No connection'}
          </p>
          <p>{signerInfo.isLogin ? 'you can see hidden info after sign-in' : ''}</p>
          <Button isDynamic={true} onClick={async () => await signInWithEthereum(setSignerInfo)}>
            Sign in with Ethereum
          </Button>
        </TabPanel>
      </Tabs>
    </>
  );
}
