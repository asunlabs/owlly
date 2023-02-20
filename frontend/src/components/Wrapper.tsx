import { breakpoints } from '@owlly/context/DefaultState';
import styled from 'styled-components';

export const WrapperTab = styled.div`
  .tab-panel {
    display: grid;
    grid-template-rows: 1fr 3fr;
    place-items: center;
    gap: 1rem;
  }

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    height: 80vh;
    padding: 5vh;
    display: grid;
    grid-template-columns: 0.4fr 0.6fr;

    #login-tab {
      background-color: white;
      color: black;
      text-align: center;
      display: grid;
      grid-template-rows: 0.3fr 0.7fr;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
    }

    .tab-panel {
      transform: scale(1.1) translateY(-3rem);
    }
  }
`;

export const WrapperDivForCenter = styled.div`
  display: block;
  text-align: center;
`;
