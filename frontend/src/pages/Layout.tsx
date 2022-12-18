import { Background } from '@owlly/components/Background';
import { Body, Dropdown, List, Navbar, Title } from '@owlly/components/Navbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { IDropdownProps, ILayoutProps } from './../context/types.d';
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

export function Layout({ children }: ILayoutProps) {
  const [toggle, setToggle] = React.useState<IDropdownProps>({
    account: false,
    bot: false,
    help: false,
  });

  const ref = React.useRef<HTMLLIElement>(null);

  function handleDropdown(e: React.MouseEvent) {
    e.preventDefault();

    const id = e.currentTarget.id;
    const defaultState: IDropdownProps = {
      account: false,
      bot: false,
      help: false,
    };

    // only render a clicked component
    setToggle({
      ...defaultState,
      [id]: true,
    });
  }

  function handleOutsideDropdown(e: any) {
    if (ref.current && !ref.current.contains(e.target)) {
      // prettier-ignore
      setToggle({ 
        account: false, 
        bot: false, 
        help: false 
      });
    }
  }

  // reset dropdown when user click outside navbar
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideDropdown);

    // cleanup event listener
    return () => {
      document.removeEventListener('click', handleOutsideDropdown);
    };
  }, [ref]);

  return (
    <Background id="layout">
      <Navbar ref={ref}>
        <Title isHome={true}>
          <AiOutlineHome />
          <Link to={'/'}>Home</Link>
        </Title>

        <Dropdown id="account" onClick={handleDropdown}>
          <Title>
            <MdAccountCircle />
            Account
          </Title>
          <List toggle={toggle.account ? true : false}>
            <AiOutlineLogin />
            <Link to={'account/login'}>Sign in</Link>
          </List>
          <List toggle={toggle.account ? true : false}>
            <FaSlack />
            <Link to={'account/slack'}>Slack</Link>
          </List>
        </Dropdown>

        <Dropdown id="bot" onClick={handleDropdown}>
          <Title>
            <AiOutlineRobot />
            Bot
          </Title>
          <List toggle={toggle.bot ? true : false}>
            <AiOutlineMoneyCollect />
            <Link to={'bot/faucet-getter'}>Faucet</Link>
          </List>
          <List toggle={toggle.bot ? true : false}>
            <AiOutlineLock />
            <Link to={'bot/env-notifier'}>Dotenv</Link>
          </List>
        </Dropdown>

        <Dropdown id="help" onClick={handleDropdown}>
          <Title>
            <MdOutlineContactSupport />
            Help
          </Title>
          <List toggle={toggle.help ? true : false}>
            <AiOutlineMail />
            <Link to={'help/contact'}>Contact</Link>
          </List>
        </Dropdown>
      </Navbar>
      <Body id="body">{children}</Body>
    </Background>
  );
}
