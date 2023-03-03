import { BRAND_COLOR, breakpoints } from '@owlly/context/constants';
import { IListProps, ITitleProps } from '@owlly/context/types';
import styled from 'styled-components';

export const Navbar = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  background-color: RGB(94 67 60);

  #fragment {
    display: none;
  }
  @media screen and (min-width: ${breakpoints.device.tablet}) {
    /* make navbar have a fixed size */
    min-width: fit-content;
    min-height: 100vh;

    #fragment {
      display: block;
      position: absolute;
      background-color: black;
    }
  }
`;

// @dev define props for styled-component
export const List = styled.li<IListProps>`
  display: ${(props) => (props.toggle ? 'grid' : 'none')};
  grid-template-columns: 1fr 2fr;
  align-items: center;
  list-style: none;
  padding: 1rem;
  background-color: ${() => BRAND_COLOR.heavyBrown};
  cursor: pointer;

  // icon
  svg {
    font-size: 1.3rem;
    padding-left: 3rem;
  }

  &:hover {
    background-color: RGB(222 210 158);
  }
`;

export const Dropdown = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const Title = styled.div<ITitleProps>`
  display: grid;
  grid-template-columns: ${({ isHome }) => (isHome ? '1fr 2fr 1fr' : '1fr 2fr')};
  justify-content: center;
  align-items: center;
  list-style: none;
  padding: 1.5rem;
  font-size: 1.4rem;
  cursor: pointer;
  color: rgb;
  background-color: ${({ isHome }) => (isHome ? 'RGB(222 210 158)' : BRAND_COLOR.lightBrown)};
  color: ${({ isHome }) => (isHome ? 'black' : '')};
  font-weight: ${({ isHome }) => (isHome ? 'bold' : 'none')};

  // icon
  svg {
    font-size: 2rem;
    padding: 1rem;
  }
`;
