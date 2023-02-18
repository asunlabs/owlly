import styled from 'styled-components';
import defaultImage from '@owlly/assets/images/pokemon/164.jpg';
import { breakpoints } from '@owlly/context/DefaultState';

export const Background = styled.div`
  background-image: url(${defaultImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  li:hover {
    font-weight: bold;
    color: black;
  }

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    display: flex;
    flex-flow: row nowrap;

    #body {
      width: 100%;
    }
  }
`;
