import { breakpoints } from '@owlly/context/DefaultState';
import * as React from 'react';
import styled from 'styled-components';

export const Navbar = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  background-color: RGB(94 67 60);
`;

export const Body = styled.div`
  width: 75%;
  padding: 2rem;
`;

// @dev define props for styled-component
export const List = styled.li<{ toggle: boolean }>`
  display: ${(props) => (props.toggle ? 'grid' : 'none')};
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  list-style: none;
  padding: 2rem;
  font-size: 1rem;
  cursor: pointer;

  // icon
  svg {
    font-size: 1.3rem;
    padding: 1rem 0;
  }
`;

export const Dropdown = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const Title = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  list-style: none;
  padding: 1.5rem;
  font-size: 1.4rem;
  cursor: pointer;

  // icon
  svg {
    font-size: 2rem;
    padding: 1rem;
  }

  &:hover {
    background-color: RGB(222 210 158);
  }
`;
