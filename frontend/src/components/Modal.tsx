import { breakpoints } from '@owlly/context/constants';
import { IModalProps } from '@owlly/context/types';
import styled, { keyframes } from 'styled-components';

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
