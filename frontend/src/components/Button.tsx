import { ToastContainer, toast, useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

export const Button = styled.button`
  // default
  font-size: 14px;
  color: black;
  background-color: skyblue;
  padding: 10px 30px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 50px;
  transition: 1000ms;
  transform: translateY(0);
  cursor: pointer;

  // hover
  &:hover {
    transition: 1000ms;
    padding: 10px 50px;
    transform: translateY(-0px);
    background-color: rgb(159, 72, 193);
    color: #000000;
    border: none;
  }
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
