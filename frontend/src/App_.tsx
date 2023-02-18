import * as React from 'react';
import { LoadingView } from '@owlly/components/Background';

export interface IApp_Props {}

export function App_(props: IApp_Props) {
  return (
    <>
      {/* render login */}
      <div>if has an account: welcome message if not: redirect to sign in</div>
    </>
  );
}
