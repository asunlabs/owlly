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
} from 'react-icons/ai';
import { MdAccountCircle, MdOutlineContactSupport } from 'react-icons/md';
import { FaSlack } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import loading from '@owlly/assets/images/loading.gif';

export function Layout({ children }: ILayoutProps) {
  const [toggle, setToggle] = React.useState<IDropdownProps>({
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
    <>
      <Background id="layout">
        {/* app booting animation */}
        {!isLaunch && (
          <LoadingView>
            <div id="description">
              <img src={loading} alt="greeting banner" />
              <p>"We want developers with 5 years of C programming experience" is a ridiculous statement.</p>
              <br />
              <p>
                If a developer didn't continue to learn C language, the next three years wouldn't make much of a
                difference.
              </p>
              <br />
              <span>- Code Complete -</span>
              <br />
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

        {/* render toast only once */}
        <ToastContainer />
      </Background>
    </>
  );
}
