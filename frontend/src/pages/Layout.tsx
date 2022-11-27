import { Background } from '@owlly/components/Background';
import { Anchor, Dropdown, List, Navbar } from '@owlly/components/Navbar';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface ILayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: ILayoutProps) {
  return (
    <>
      <Background id="layout">
        <Navbar>
          <Anchor href="#">Owlly</Anchor>

          <List>
            <Link to={'/'}>Home</Link>
          </List>

          <List>
            <Link to={'account/login'}>Sign in</Link>
          </List>

          <List>
            <Link to={'account/slack'}>Manage Slack</Link>
          </List>

          <List>
            <Link to={'automation/faucet-getter'}>Faucet bot</Link>
          </List>

          <List>
            <Link to={'bot/env-notifier'}>ENV bot</Link>
          </List>
        </Navbar>
        {children}
      </Background>
    </>
  );
}
