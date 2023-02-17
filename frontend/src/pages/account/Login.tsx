import { Button, GetToastByStatus } from '@owlly/components/Button';
import * as React from 'react';
import { Form, FormTitle, Input, Label, SolidBanner } from '@owlly/components/Form';
import { MdOutlinePassword } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import { EVENT_AUTH } from '@owlly/context/DefaultState';
import { ISignerInfoProps, TypeSignUp, IWailsResponse } from '@owlly/context/types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsKey } from 'react-icons/bs';
import 'react-tabs/style/react-tabs.css';
import { WrapperDivForCenter, WrapperTab } from '@owlly/components/Wrapper';
import { Modal, ModalIconWrapper } from '@owlly/components/Modal';
import { AiFillCloseCircle } from 'react-icons/ai';
import { EventsEmit as SendWailsRequest } from '@wailsjs/runtime/runtime';
import { ReceiveWailsResponseForEmailSignIn, ReceiveWailsResponseForEmailSignUp } from '@wailsjs/go/main/Owlly';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithEthereum } from './SIWE';
import mascot from '@owlly/assets/images/mascot.jpg';

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
    const email = formData.get('signin-email');
    const password = formData.get('signin-password');

    if (email !== null && password !== null) {
      SendWailsRequest(EVENT_AUTH.signIn, JSON.stringify(email), JSON.stringify(password));
      const _response = (await ReceiveWailsResponseForEmailSignIn(
        JSON.stringify(email),
        JSON.stringify(password)
      )) as IWailsResponse;

      if (_response.Code == '200') {
        GetToastByStatus('success', 'Email login success');

        setTimeout(() => {
          setIsLogin(true);
          setWailsResponse(_response);
        }, 1800);
      } else {
        GetToastByStatus('failure', 'Email login failure');

        setTimeout(() => {
          setIsModal(false);
        }, 1800);
      }
    }
  }

  async function handleEmailSignUp(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('signup-email');
    const password = formData.get('signup-password');

    SendWailsRequest(EVENT_AUTH.signUp, email, password);
    const _response = await ReceiveWailsResponseForEmailSignUp();

    if (_response.Code == '200') {
      GetToastByStatus('success', 'Email sign up success');

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

  return (
    <>
      <FormTitle>Owlly: Sign in with Email</FormTitle>

      <Form onSubmit={handleEmailSignIn}>
        <Label htmlFor="email">
          <AiOutlineMail />
          <Input name="signin-email" id="email" type={'email'} placeholder={'Email'} />
        </Label>
        <Label htmlFor="password">
          <MdOutlinePassword />
          <Input name="signin-password" id="password" type={'password'} placeholder={'Password'} />
        </Label>
        <Button isDynamic={true} type={'button'} id={'sign-up'} onClick={() => handleSignUpModal('email', setIsModal)}>
          Don't have an account?
        </Button>
        <Button transparent={true} type={'submit'} id={'sign-in'}>
          Sign in
        </Button>
        <ToastContainer />
      </Form>

      {/* Invoke sign up modal */}
      {isModal && (
        <>
          <Modal modalType="email">
            <FormTitle>Owlly: Create an email account</FormTitle>
            <ModalIconWrapper onClick={() => setIsModal(false)}>
              <AiFillCloseCircle />
            </ModalIconWrapper>
            <Form onSubmit={handleEmailSignUp}>
              <Label htmlFor="email">
                <AiOutlineMail />
                <Input name="signup-email" id="email" type={'email'} placeholder={'Email'} />
              </Label>
              <Label htmlFor="password">
                <MdOutlinePassword />
                <Input name="signup-password" id="password" type={'password'} placeholder={'Password'} />
              </Label>
              <Button transparent={true} type={'submit'} id={'sign-up'}>
                Sign up
              </Button>
              <ToastContainer />
            </Form>
          </Modal>
        </>
      )}

      {/* Render profile if login successful */}
      {/* TODO db read test */}
      {isLogin && <div>{JSON.stringify(wailsResponse)}</div>}
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
          <Input id="privateKey" type={'password'} placeholder={'Private key'} />
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
            <ModalIconWrapper onClick={() => setIsModal(false)}>
              <AiFillCloseCircle />
            </ModalIconWrapper>
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

export function Profile() {
  return <div>user profile here</div>;
}

export function Login() {
  return (
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
  );
}
