import { Background } from '@owlly/components/Background';
import { Anchor, Body, Dropdown, List, Navbar } from '@owlly/components/Navbar';
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
          <List>
            <Link to={'/'}>Home</Link>
          </List>

          <List>
            <Link to={'account/login'}>🗝️ Sign in</Link>
          </List>

          <List>
            <Link to={'account/slack'}>📩 Slack</Link>
          </List>

          <List>
            <Link to={'automation/faucet-getter'}>💸 Faucet</Link>
          </List>

          <List>
            <Link to={'bot/env-notifier'}>🔐 Dotenv</Link>
          </List>
        </Navbar>
        <Body id="body">{children}</Body>
      </Background>
    </>
  );
}
