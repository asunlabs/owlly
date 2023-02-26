import styled, { keyframes } from 'styled-components';
import { breakpoints } from '@owlly/context/constants';

export const Background = styled.div`
  display: flex;
  background-color: red;
  flex-flow: column nowrap;

  li:hover {
    font-weight: bold;
    color: black;
  }

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    flex-flow: row nowrap;
  }
`;

const FadeIn = keyframes`
  0% {
    opacity: 1;
    background-color: black;
  }
  50% {
    background-color: white;
  }
  100% {
    opacity: 1;
  }
`;

export const LoadingView = styled.div`
  background-color: white;
  color: black;
  position: absolute;
  width: 100%;
  height: 100vh;
  text-align: center;
  z-index: 10;
  animation: ${FadeIn} 3s 1 ease-in;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  #description {
    padding: 2rem;
    transform: translateY(-5%);
  }

  p {
    /* display: table; */
    max-width: 70%;
    line-height: 1.5rem;
    margin: 0 auto;
    text-align: left;
    font-size: 1.2rem;
    /* background-color: #efefef; */
  }

  #launch-button {
    margin-top: 2rem;
  }

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    p {
      text-align: center;
    }
  }
  /* img {
  } */
`;
