import { breakpoints } from '@owlly/context/DefaultState';
import styled from 'styled-components';

export const Navbar = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  background-color: RGB(94 67 60);
  width: 100%;

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    width: fit-content;
  }
`;

export const Body = styled.div``;

export interface IListProps {
  toggle?: boolean;
}

// @dev define props for styled-component
export const List = styled.li<IListProps>`
  display: ${(props) => (props.toggle ? 'grid' : 'none')};
  grid-template-columns: 1fr 2fr;
  align-items: center;
  list-style: none;
  padding: 1rem;
  cursor: pointer;
  border-radius: 20%;

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

export interface ITitleProps {
  isHome?: boolean;
}

export const Title = styled.div<ITitleProps>`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  list-style: none;
  padding: 1.5rem;
  font-size: 1.4rem;
  cursor: pointer;
  background-color: ${({ isHome }) => (isHome ? 'RGB(222 210 158)' : 'none')};
  color: ${({ isHome }) => (isHome ? 'black' : '')};
  font-weight: ${({ isHome }) => (isHome ? 'bold' : 'none')};

  // icon
  svg {
    font-size: 2rem;
    padding: 1rem;
  }
`;
