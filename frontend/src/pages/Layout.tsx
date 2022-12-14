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
import { MdAccountCircle, MdOutlineContactSupport } from 'react-icons/md';
import { FaSlack } from 'react-icons/fa';

export interface ILayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: ILayoutProps) {
  const [toggle, setToggle] = React.useState({
    isToggle: false,
    account: false,
    bot: false,
    help: false,
  });

  return (
    <Background id="layout">
      <Navbar>
        <Title isHome={true}>
          <AiOutlineHome />
          <Link to={'/'}>Home</Link>
        </Title>

        <Dropdown
          id="dropdown-account"
          onClick={() =>
            setToggle({
              isToggle: true,
              account: true,
              bot: false,
              help: false,
            })
          }
        >
          <Title>
            <MdAccountCircle />
            Account
          </Title>
          <List toggle={toggle.isToggle && toggle.account ? true : false}>
            <AiOutlineLogin />
            <Link to={'account/login'}>Sign in</Link>
          </List>
          <List toggle={toggle.isToggle && toggle.account ? true : false}>
            <FaSlack />
            <Link to={'account/slack'}>Slack</Link>
          </List>
        </Dropdown>

        <Dropdown
          id="dropdown-bot"
          onClick={() =>
            setToggle({
              isToggle: true,
              account: false,
              bot: true,
              help: false,
            })
          }
        >
          <Title>
            <AiOutlineRobot />
            Bot
          </Title>
          <List toggle={toggle.isToggle && toggle.bot ? true : false}>
            <AiOutlineMoneyCollect />
            <Link to={'bot/faucet-getter'}>Faucet</Link>
          </List>
          <List toggle={toggle.isToggle && toggle.bot ? true : false}>
            <AiOutlineLock />
            <Link to={'bot/env-notifier'}>Dotenv</Link>
          </List>
        </Dropdown>

        <Dropdown
          onClick={() =>
            setToggle({
              isToggle: true,
              account: false,
              bot: false,
              help: true,
            })
          }
        >
          <Title>
            <MdOutlineContactSupport />
            Help
          </Title>
          <List toggle={toggle.isToggle && toggle.help ? true : false}>
            <AiOutlineMail />
            <Link to={'help/contact'}>Contact</Link>
          </List>
        </Dropdown>
      </Navbar>
      <Body id="body">{children}</Body>
    </Background>
  );
}
