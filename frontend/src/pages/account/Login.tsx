import { Button, GetToastByStatus } from '@owlly/components/Button';
import * as React from 'react';
import { Form, FormTitle, Input, Label, SolidBanner } from '@owlly/components/Form';
import { MdOutlinePassword } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import { ISignerInfoProps, TypeSignUp, IWailsResponse } from '@owlly/context/types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsKey } from 'react-icons/bs';
import 'react-tabs/style/react-tabs.css';
import { WrapperDivForCenter, WrapperModalIcon, WrapperTab } from '@owlly/components/Wrapper';
import { Modal } from '@owlly/components/Modal';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ReadEmailUser_, CreateEmailUser_ } from '@wailsjs/go/main/Owlly';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithEthereum } from './SIWE';
import mascot from '@owlly/assets/images/mascot.jpg';
import TextField from '@mui/material/TextField';
import { DefaultProfile } from './Profile';

function EmailLogin() {
  const [isModal, setIsModal] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const [wailsResponse, setWailsResponse] = React.useState<IWailsResponse>({
    Code: '',
    Message: '',
  });

  async function handleEmailSignIn(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('signin-email')?.toString();
    const password = formData.get('signin-password')?.toString();

    // @dev careful string input format, which affect bcrypt hashing
    console.log('email type: ', typeof email); // string
    console.log('email to string: ', email?.toString()); // hash@gmail.com
    console.log('email stringify: ', JSON.stringify(email)); // "hash@gmail.com"

    if (email !== undefined && password !== undefined) {
      const _response = (await ReadEmailUser_(email, password)) as IWailsResponse;

      if (_response.Code == '200') {
        GetToastByStatus('success', 'Email login success');

        setTimeout(() => {
          setIsLogin(true);
          setWailsResponse(_response);
        }, 1800);
      } else {
        GetToastByStatus('failure', 'Email login failure');

        setTimeout(() => {
          setIsLogin(true);
          setWailsResponse(_response);
        }, 1800);
      }
    }
  }

  async function handleEmailSignUp(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('signup-email')?.toString();
    const password = formData.get('signup-password')?.toString();

    if (email !== undefined && password !== undefined) {
      const _response = await CreateEmailUser_(email, password);

      if (_response.Code == '200') {
        GetToastByStatus('success', 'Email sign up success');
        setWailsResponse(_response);
        setTimeout(() => {
          setIsModal(false);
        }, 1800);
      } else {
        GetToastByStatus('failure', 'Email sign up failure');

        setTimeout(() => {
          setIsModal(false);
        }, 1800);
      }
    }
  }

  return (
    <>
      <FormTitle>Owlly: Sign in with Email</FormTitle>

      <Form onSubmit={handleEmailSignIn}>
        <Label htmlFor="email">
          <AiOutlineMail />
          <TextField name="signin-email" id="email" label="Email" type={'email'} variant="filled" />
        </Label>
        <Label htmlFor="password">
          <MdOutlinePassword />
          <TextField name="signin-password" id="password" label="Password" type={'password'} variant="filled" />
        </Label>
        <Button isDynamic={true} type={'button'} id={'sign-up'} onClick={() => handleSignUpModal('email', setIsModal)}>
          Don't have an account?
        </Button>
        <Button transparent={true} type={'submit'} id={'sign-in'}>
          Sign in
        </Button>
      </Form>

      {/* Invoke sign up modal */}
      {isModal && (
        <>
          <Modal modalType="email">
            <FormTitle>Owlly: Create an email account</FormTitle>
            <WrapperModalIcon onClick={() => setIsModal(false)}>
              <AiFillCloseCircle />
            </WrapperModalIcon>
            <Form onSubmit={handleEmailSignUp}>
              <Label htmlFor="email">
                <AiOutlineMail />
                <TextField name="signup-email" id="email" label="Email" type={'email'} variant="filled" />
              </Label>
              <Label htmlFor="password">
                <MdOutlinePassword />
                <TextField name="signup-password" id="password" label="Password" type={'password'} variant="filled" />
              </Label>
              <Button transparent={true} type={'submit'} id={'sign-up'}>
                Sign up
              </Button>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
}

function handleSignUpModal(signUpType: TypeSignUp, callback: React.Dispatch<React.SetStateAction<boolean>>) {
  switch (signUpType) {
    case 'email':
      callback(true);
    case 'wallet':
      callback(true);
      break;

    default:
      throw new Error('Login.tsx: Invalid sign-up type');
  }
}

function WalletLogin() {
  const [signerInfo, setSignerInfo] = React.useState<ISignerInfoProps>({
    address: '',
    balance: '0',
    network: '',
    isActive: false,
    isLogin: false,
  });

  const [isModal, setIsModal] = React.useState(false);

  return (
    <>
      <FormTitle>Owlly: Sign in with Wallet</FormTitle>
      <Form>
        <Label htmlFor="privateKey">
          <BsKey />
          <TextField name="privateKey" id="privateKey" label="Private key" type={'password'} variant="filled" />
        </Label>

        <Button
          className="button"
          isDynamic={true}
          type={'button'}
          id={'sign-up'}
          onClick={() => handleSignUpModal('wallet', setIsModal)}
        >
          Don't have an account?
        </Button>
        <Button
          className="button"
          type={'button'}
          id={'sign-in'}
          transparent={true}
          onClick={async () => await signInWithEthereum(setSignerInfo)}
        >
          Sign in
        </Button>
      </Form>

      {isModal && (
        <>
          <Modal modalType="wallet">
            <FormTitle>Owlly: Create a wallet account</FormTitle>
            <WrapperModalIcon onClick={() => setIsModal(false)}>
              <AiFillCloseCircle />
            </WrapperModalIcon>
            <Form>
              <Label htmlFor="privateKey">
                <BsKey />
                <Input name="signup-private-key" id="privateKey" type={'password'} placeholder={'Private key'} />
              </Label>
              <Label htmlFor="password">
                <MdOutlinePassword />
                <Input
                  name="signup-alchemy-api-key"
                  id="alchemyApiKey"
                  type={'password'}
                  placeholder={'Alchemy api key'}
                />
              </Label>
              <Button transparent={true} type={'button'} id={'sign-up'}>
                Sign up
              </Button>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
}

export function Login() {
  return (
    <div>
      <WrapperTab id="login">
        <SolidBanner>
          <span id="title">Welcome</span>
          <p id="description">
            to the demo application made by developerasun - a collection of automation bots for blockchain developers,
            based on Wails. Mascot credit to @HaidiYJ.
          </p>
          <WrapperDivForCenter id="mascot">
            <img id="mascot" src={mascot} alt="mascot" loading="lazy" width="60%" />
          </WrapperDivForCenter>
        </SolidBanner>

        <Tabs id="login-tab">
          <TabList className="tab-item">
            <Tab>Quick start</Tab>
            <Tab>Experimental</Tab>
          </TabList>

          <div id="panel-wrapper">
            <TabPanel className={'tab-panel'}>
              <EmailLogin />
            </TabPanel>
            <TabPanel className={'tab-panel'}>
              <WalletLogin />
            </TabPanel>
          </div>
        </Tabs>
      </WrapperTab>
    </div>
  );
}
