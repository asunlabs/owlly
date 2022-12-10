import { breakpoints } from '@owlly/context/DefaultState';
import * as React from 'react';
import styled from 'styled-components';

export const Navbar = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  background-color: RGB(94 67 60);
  height: 100vh;
  width: 25%;
`;

export const Body = styled.div`
  width: 75%;
  padding: 2rem;
`;

export const List = styled.li`
  list-style: none;
  padding: 1rem;
  font-size: large;
  cursor: pointer;

  &:hover {
    background-color: RGB(222 210 158);
  }
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
