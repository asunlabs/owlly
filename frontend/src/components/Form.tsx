import styled from 'styled-components';

export const Form = styled.form`
  width: fit-content;
  display: grid;
  gap: 1rem;
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
