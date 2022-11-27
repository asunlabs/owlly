import { breakpoints } from '@owlly/context/DefaultState';
import * as React from 'react';
import styled from 'styled-components';

export interface INavbarProps {}

export const Navbar = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  background-color: RGB(94 67 60);
  @media (min-width: ${breakpoints.device.tablet}) {
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }
`;

export const List = styled.li`
  list-style: none;
  padding: 1rem;
  font-size: large;
  cursor: pointer;
`;

export const Dropdown = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const Anchor = styled.a`
  text-decoration: none;
`;

export const SearchForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
`;
