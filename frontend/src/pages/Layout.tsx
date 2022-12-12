import { Background } from '@owlly/components/Background';
import { Body, Dropdown, List, Navbar, Title } from '@owlly/components/Navbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineLogin,
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineMoneyCollect,
  AiOutlineLock,
  AiOutlineRobot,
} from 'react-icons/ai';
import { MdAccountCircle } from 'react-icons/md';

export interface ILayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: ILayoutProps) {
  const [toggle, setToggle] = React.useState(false);

  return (
    <Background id="layout">
      <Navbar>
        <List toggle>
          <AiOutlineHome />
          <Link to={'/'}>Home</Link>
        </List>

        <Dropdown onClick={() => setToggle(!toggle)}>
          <Title>
            <MdAccountCircle />
            Account
          </Title>
          <List toggle={toggle}>
            <AiOutlineLogin />
            <Link to={'account/login'}>Sign in</Link>
          </List>
          <List toggle={toggle}>
            <AiOutlineMail />
            <Link to={'account/slack'}>Slack</Link>
          </List>
        </Dropdown>

        <Dropdown onClick={() => setToggle(!toggle)}>
          <Title>
            <AiOutlineRobot />
            Bot
          </Title>
          <List toggle={toggle}>
            <AiOutlineMoneyCollect />
            <Link to={'bot/faucet-getter'}>Faucet</Link>
          </List>

          <List toggle={toggle}>
            <AiOutlineLock />
            <Link to={'bot/env-notifier'}>Dotenv</Link>
          </List>
        </Dropdown>
      </Navbar>
      <Body id="body">{children}</Body>
    </Background>
  );
}
