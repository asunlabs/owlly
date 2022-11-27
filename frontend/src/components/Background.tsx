import * as React from 'react';
import styled from 'styled-components';
import defaultImage from '@owlly/assets/images/pokemon/164.jpg';

export const Background = styled.div`
  color: white;
  background-image: url(${defaultImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100%;

  li:hover {
    font-weight: bold;
    color: black;
  }
`;
