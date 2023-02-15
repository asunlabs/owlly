import { Button, GetToastByStatus } from '@owlly/components/Button';
import * as React from 'react';
import { Form, FormTitle, Input, Label } from '@owlly/components/Form';
import { MdOutlinePassword } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';
import { EVENT_AUTH } from '@owlly/context/DefaultState';
import { ISignerInfoProps, TypeSignUp } from '@owlly/context/types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { BsKey } from 'react-icons/bs';
import 'react-tabs/style/react-tabs.css';
import { WrapperTab, WrapperTabPanel } from '@owlly/components/Wrapper';
import { Modal, ModalIconWrapper } from '@owlly/components/Modal';
import { AiFillCloseCircle } from 'react-icons/ai';
import { EventsEmit as SendWailsRequest } from '@wailsjs/runtime/runtime';
import { HandleEmailSignUp } from '@wailsjs/go/main/Owlly';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmailLogin() {
  const [isModal, setIsModal] = React.useState(false);

  async function handleEmailSignUp(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('signup-email');
    const password = formData.get('signup-password');

    SendWailsRequest(EVENT_AUTH.signUp, email, password);
    const _response = await HandleEmailSignUp();

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

      <Form>
        <Label htmlFor="email">
          <AiOutlineMail />
          <Input id="email" type={'email'} placeholder={'Email'} />
        </Label>
        <Label htmlFor="password">
          <MdOutlinePassword />
          <Input id="password" type={'password'} placeholder={'Password'} />
        </Label>
        <Button isDynamic={true} type={'button'} id={'sign-up'} onClick={() => handleSignUpModal('email', setIsModal)}>
          Don't have an account?
        </Button>
        <Button transparent={true} type={'button'} id={'sign-in'}>
          Sign in
        </Button>
      </Form>
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

export function Login() {
  return (
    <WrapperTab id="login">
      <Tabs id="login-tab">
        <TabList>
          <Tab>Quick start</Tab>
          <Tab>Experimental</Tab>
        </TabList>

        <TabPanel className={'tab-panel'}>
          <EmailLogin />
        </TabPanel>
        <TabPanel className={'tab-panel'}>
          <WalletLogin />
        </TabPanel>
      </Tabs>
    </WrapperTab>
  );
}
