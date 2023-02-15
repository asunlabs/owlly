import { breakpoints } from '@owlly/context/DefaultState';
import styled, { css } from 'styled-components';

export const Form = styled.form`
  display: grid;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  label {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }
`;

export const FormTitle = styled.h2`
  font-size: large;
  font-weight: bold;
  color: rgb(244, 248, 247);

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    color: black;
  }
`;

export const Input = styled.input`
  border: none;
  border-width: 0;
  box-shadow: none;
  outline: none;
  background-color: rgb(244, 248, 247);
  line-height: 2rem;
`;

export const Label = styled.label`
  margin: 0 1rem;
  svg {
    font-size: 2rem;
    padding-right: 1rem;
  }
`;

export const Fieldset = styled.fieldset``;

export const SolidBanner = styled.div`
  display: none;

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    display: grid;
    grid-template-rows: 0.2fr 0.3fr 0.5fr;
    font-size: 1.5rem;
    justify-content: center;
    align-items: center;
    background-color: RGB(94 67 60);
    color: white;
    padding: 4rem;
    text-align: left;

    #title {
      font-size: 1.5rem;
      font-weight: bold;
    }
    #description {
      font-size: 1rem;
      transform: translateY(1rem);
    }
    #mascot {
      transform: translateY(1.5rem);
    }
  }
`;
