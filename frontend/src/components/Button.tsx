import 'react-toastify/dist/ReactToastify.css';
import styled, { css } from 'styled-components';

interface IButtonProps {
  primary?: boolean;
}

export const Button = styled.button<IButtonProps>`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;

  ${({ primary }: IButtonProps) =>
    primary &&
    css`
      background: palevioletred;
      color: white;
    `};
`;
