import { breakpoints } from '@owlly/context/DefaultState';
import styled from 'styled-components';

export const WrapperTab = styled.div`
  #login-tab {
    /* background-color: #4b869d; */
    /* padding: 4rem; */
  }
  .tab-panel {
    display: grid;
    grid-template-rows: 1fr 3fr;
    place-items: center;
    gap: 1rem;
  }
  @media screen and (min-width: ${breakpoints.device.tablet}) {
    /* height: 100vh; */
    padding: 4rem;
  }
`;

export const WrapperTabPanel = styled.div`
  /* .tab-panel {
    display: grid;
    grid-template-rows: 1fr 3fr;
    place-items: center;
    gap: 1rem;
  } */
`;
