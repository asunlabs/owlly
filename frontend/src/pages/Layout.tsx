import { Background, LoadingView } from '@owlly/components/Background';
import { Button, GetToastByStatus } from '@owlly/components/Button';
import { Dropdown, List, Navbar, Title } from '@owlly/components/Navbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { IDropdownProps, ILayoutProps, IIsLaunchProps } from '@owlly/context/types.d';
import {
  AiOutlineLogin,
  AiOutlineHome,
  AiOutlineMail,
  AiOutlineMoneyCollect,
  AiOutlineLock,
  AiOutlineRobot,
  AiFillCloseCircle,
  AiOutlineMenu,
} from 'react-icons/ai';
import { MdAccountCircle, MdOutlineContactSupport } from 'react-icons/md';
import { FaSlack } from 'react-icons/fa';
import loading from '@owlly/assets/images/loading.gif';
import { WrapperDivForCenter, WrapperModalIcon } from '@owlly/components/Wrapper';
import { breakpoints } from '../context/constants';

export function Layout({ children }: ILayoutProps) {
  const [toggle, setToggle] = React.useState(false);
  const [dropdown, setDropdown] = React.useState<IDropdownProps>({
    account: false,
    bot: false,
    help: false,
  });
  const [isLaunch, setIsLaunch] = React.useState<IIsLaunchProps>({
    disable: false,
    launch: false,
  });

  function handleAppLaunch() {
    setIsLaunch((prev) => ({
      ...prev,
      disable: true,
    }));
    GetToastByStatus('success', 'Launching Owlly...');
    setTimeout(() => {
      setIsLaunch((prev) => ({
        ...prev,
        launch: true,
      }));
    }, 1800);
  }

  function handleToggle() {
    setToggle(!toggle);
  }

  function handleDropdown(e: React.MouseEvent) {
    e.preventDefault();

    const id = e.currentTarget.id;
    const defaultState: IDropdownProps = {
      account: false,
      bot: false,
      help: false,
    };

    // only render a clicked component
    setDropdown({
      ...defaultState,
      [id]: true,
    });
  }

  function handleResize() {
    if (window.innerWidth >= parseInt(breakpoints.device.tablet)) {
      setToggle(true);
    }
  }

  function handleOutsideDropdown(e: any) {
    if (window.innerWidth < parseInt(breakpoints.device.tablet)) {
      setToggle(false);
    }
  }

  // @dev React replaces `addEventListener` with SyntheticEvent for a few reasons: https://linguinecode.com/post/react-onclick-event-vs-js-addeventlistener
  // SyntheticEvent is preferred over `addEventListener` generally
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    // have to clean up oneself
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <>
      <Background id="layout">
        {/* app contents */}
        <Navbar id="navbar">
          {/* app booting animation */}
          {!isLaunch.launch && (
            <LoadingView>
              <div id="description">
                <img src={loading} alt="greeting banner" />
                <h1>Welcome to Owlly</h1>
                <Button id="launch-button" isDynamic={true} onClick={handleAppLaunch} disabled={isLaunch.disable}>
                  Launch App
                </Button>
              </div>
            </LoadingView>
          )}
          <Title isHome={true}>
            <AiOutlineHome />
            <Link to={'/'}>Owlly</Link>
            <WrapperModalIcon onClick={handleToggle}>
              {toggle ? <AiFillCloseCircle className="trigger" /> : <AiOutlineMenu className="trigger" />}
            </WrapperModalIcon>
          </Title>

          <div id="dropdowns">
            {toggle ? (
              <>
                <Dropdown id="account" onClick={handleDropdown}>
                  <Title>
                    <MdAccountCircle />
                    Account
                  </Title>
                  <List toggle={dropdown.account ? true : false}>
                    <AiOutlineLogin />
                    <Link to={'account/login'}>Sign in</Link>
                  </List>
                  <List toggle={dropdown.account ? true : false}>
                    <FaSlack />
                    <Link to={'account/slack'}>Slack</Link>
                  </List>
                </Dropdown>
                <Dropdown id="bot" onClick={handleDropdown}>
                  <Title>
                    <AiOutlineRobot />
                    Bot
                  </Title>
                  <List toggle={dropdown.bot ? true : false}>
                    <AiOutlineMoneyCollect />
                    <Link to={'bot/faucet-getter'}>Faucet</Link>
                  </List>
                  <List toggle={dropdown.bot ? true : false}>
                    <AiOutlineLock />
                    <Link to={'bot/env-notifier'}>Dotenv</Link>
                  </List>
                </Dropdown>
                <Dropdown id="help" onClick={handleDropdown}>
                  <Title>
                    <MdOutlineContactSupport />
                    About
                  </Title>
                  <List toggle={dropdown.help ? true : false}>
                    <AiOutlineMail />
                    <Link to={'help/contact'}>Contact</Link>
                  </List>
                </Dropdown>

                <WrapperDivForCenter id="fragment">Made with love by @asunlabs</WrapperDivForCenter>
              </>
            ) : (
              <></>
            )}
          </div>
        </Navbar>
        {/* prettier-ignore */}
        <div onClick={handleOutsideDropdown}>
          {children}
        </div>
      </Background>
    </>
  );
}
