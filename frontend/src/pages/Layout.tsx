import * as React from 'react';
import { Link } from 'react-router-dom';

export interface ILayoutProps {}

export function Layout(props: ILayoutProps) {
  return (
    <div>
      <Link to={'bot/env-notifier'}>Env Notifier</Link>
    </div>
  );
}
