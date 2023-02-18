import styled, { keyframes } from 'styled-components';
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

const FadeIn = keyframes`
  0% {
    opacity: 0;
    background-color: black;
  }
  50% {
    opacity: 0.5;
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
  animation: ${FadeIn} 2s 1 ease-in;

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
