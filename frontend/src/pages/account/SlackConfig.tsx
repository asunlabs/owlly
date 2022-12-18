import { SlackContext } from '@owlly/context/DefaultState';
import * as React from 'react';

export interface ISlackConfigProps {}

export function SlackConfig(props: ISlackConfigProps) {
  // @dev check slack context is working
  const slackContext = React.useContext(SlackContext);

  return <div>{JSON.stringify(slackContext.slackContext)}</div>;
}
