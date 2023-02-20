import { Background, LoadingView } from '@owlly/components/Background';
import { Button, GetToastByStatus } from '@owlly/components/Button';
import { Body, Dropdown, List, Navbar, Title } from '@owlly/components/Navbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { IDropdownProps, ILayoutProps } from '@owlly/context/types.d';
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
import { ToastContainer } from 'react-toastify';
import loading from '@owlly/assets/images/loading.gif';
import { ModalIconWrapper } from '@owlly/components/Modal';

export function Layout({ children }: ILayoutProps) {
  const [toggle, setToggle] = React.useState(false);
  const [dropdown, setDropdown] = React.useState<IDropdownProps>({
    account: false,
    bot: false,
    help: false,
  });
  const [isLaunch, setIsLaunch] = React.useState(false);
  const ref = React.useRef<HTMLLIElement>(null);

  function handleAppLaunch() {
    GetToastByStatus('success', 'Launching Owlly...');
    setTimeout(() => {
      setIsLaunch(true);
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

  function handleOutsideDropdown(e: any) {
    if (ref.current && !ref.current.contains(e.target)) {
      // prettier-ignore
      setDropdown({ 
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
    <>
      <Background id="layout">
        {/* app booting animation */}
        {!isLaunch && (
          <LoadingView>
            <div id="description">
              <img src={loading} alt="greeting banner" />
              <h1>Welcome to Owlly</h1>
              <Button id="launch-button" isDynamic={true} onClick={handleAppLaunch}>
                Launch App
              </Button>
            </div>
          </LoadingView>
        )}

        {/* app contents */}
        <Navbar ref={ref}>
          <Title isHome={true}>
            <AiOutlineHome />
            <Link to={'/'}>Owlly</Link>
            {/* TODO fix media query */}
            <ModalIconWrapper onClick={handleToggle}>
              {toggle ? <AiFillCloseCircle /> : <AiOutlineMenu />}
            </ModalIconWrapper>
          </Title>

          {toggle && (
            <div id="dropdowns">
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
                  Help
                </Title>
                <List toggle={dropdown.help ? true : false}>
                  <AiOutlineMail />
                  <Link to={'help/contact'}>Contact</Link>
                </List>
              </Dropdown>
            </div>
          )}
        </Navbar>
        <Body id="body">{children}</Body>

        {/* render toast only once */}
        <ToastContainer />
      </Background>
    </>
  );
}
