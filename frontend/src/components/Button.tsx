import { TypeToastStatus } from '@owlly/context/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { css } from 'styled-components';

export interface IButtonProps {
  isDynamic?: boolean;
  transparent?: boolean;
}

export const Button = styled.button<IButtonProps>`
  // default
  font-size: 14px;
  color: black;
  background-color: #eabb87;
  padding: 10px 30px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 50px;
  transition: 1000ms;
  transform: translateY(0);
  cursor: pointer;

  // hover
  ${(props) =>
    props.isDynamic &&
    css`
  &:hover {
    color:white;
    font-weight: bold;
    transition: 1000ms;
    padding: 10px 50px;
    transform: translateY(-0px);
    background-color: rgb(159, 72, 193);
    border: none;
  `}

  ${(props) =>
    props.transparent &&
    css`
      background-color: transparent;
      border: 1px solid skyblue;

      &:hover {
        width: fit-contents;
        color: white;
        font-weight: bold;
      }
    `}
`;

export function ToastNotification() {
  const notify = () => {
    toast.info(<div>✉️ DM processing!</div>, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 1000,
      icon: '🦉',
      theme: 'dark',
    });
  };

  return (
    <div>
      <Button type="submit" onClick={notify}>
        Send DM
      </Button>
      <ToastContainer />
    </div>
  );
}

export function GetToastByStatus(status: TypeToastStatus, message: string) {
  if (status === 'success') {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 800,
      icon: '🗨️🦉',
      theme: 'dark',
    });
  }

  if (status === 'failure') {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 800,
      icon: '🗨️💀',
      theme: 'dark',
    });
  }
}
