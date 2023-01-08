import { breakpoints } from '@owlly/context/DefaultState';
import styled, { css } from 'styled-components';

export interface IModalProps {
  modalType: string;
}

export const Modal = styled.div<IModalProps>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  transform: translateY(50%);
  width: 100%;
  height: 50vh;
  background-color: ${(props) => (props.modalType === 'email' ? '#709d22' : '#1d8078')};

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    width: 50%;
    height: 50%;
  }
`;

export const ModalIconWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;

  &:hover {
    color: black;
    cursor: pointer;
    transition-duration: 1s;
  }
`;
