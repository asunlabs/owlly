import { breakpoints } from '@owlly/context/DefaultState';
import styled from 'styled-components';

export const WrapperTab = styled.div`
  #login-tab {
    width: 100%;
    height: auto;
    background-color: #4b869d;
  }
  @media screen and (min-width: ${breakpoints.device.tablet}) {
    width: 60vw;
  }
`;

export const WrapperTabPanel = styled.div`
  .tab-panel {
    display: grid;
    grid-template-rows: 1fr 3fr;
    place-items: center;
    gap: 1rem;
  }
`;
