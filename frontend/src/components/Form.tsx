import styled from 'styled-components';

export const Form = styled.form`
  width: fit-content;
  display: grid;
  align-items: center;
  justify-contents: center;

  label {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-contents: center;
  }
`;

export const FormTitle = styled.div`
  font-size: large;
  font-weight: bold;
  color: rgb(244, 248, 247);
`;

export const Input = styled.input`
  border: none;
  border-width: 0;
  box-shadow: none;
  outline: none;
  background-color: rgb(244, 248, 247);
`;
export const Label = styled.label``;

export const Fieldset = styled.fieldset``;
