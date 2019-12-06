import { clearFix } from 'polished';
import React from 'react';
// import Icons from '../../atoms/icons.tsx'
import styled from '../../../themes/styled';
import { Box } from 'rebass/styled-components';
import { X } from 'react-feather';
import media from 'styled-media-query';
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(51, 60, 69, 0.95);
  z-index: 10000000;
  height: 100%;
  justify-content: center;
  overflow: auto;
  cursor: pointer;
`;

const Dialog = styled.div`
  width: 700px;
  box-shadow: 0 2px 8px 3px rgba(0, 0, 0, 0.3);
  z-index: 9999999999;
  background-color: #ffffff;
  padding: 0;
  margin: 40px auto;
  position: fixed;
  top: 10px;
  left: 50%;
  margin-left: -350px;
  border-radius: 3px;
  outline: none;

  ${media.lessThan('medium')`
    width: auto;
    margin: 0;
    left: 8px;
    right: 8px;
    top: 8px;
    // bottom: 8px;
  `};
`;

const Action = styled.div`
  ${clearFix()};
  padding-top: 10px;
  padding-right: 10px;
  position: relative;
`;

const Close = styled(Box)`
  position: absolute;
  right: -10px;
  top: -10px;
  cursor: pointer;
  background: ${props => props.theme.colors.orange};
  width: 24px;
  height: 24px;
  border-radius: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999999;
`;

const Content = styled.div`
  ${clearFix()};
  max-height: 90vh;
  padding: 16px;
  font-family: ${props => props.theme.fontFamily};
`;

export const Container = styled.div`
  font-family: ${props => props.theme.fontFamily};
`;
export const Actions = styled.div`
  ${clearFix()};
  height: 60px;
  padding-top: 10px;
  padding-right: 10px;
  & button {
    float: right;
  }
`;

export const CounterChars = styled.div`
  float: right;
  font-size: 11px;
  text-transform: uppercase;
  background: #d0d9db;
  padding: 2px 10px;
  font-weight: 600;
  margin-top: 4px;
  color: #32302e;
  letter-spacing: 1px;
`;

export const ContainerForm = styled.div`
  flex: 1;
  ${clearFix()};
  input {
    height: 40px;
    background: white;
    border-radius: 2px;
    border: 1px solid ${props => props.theme.colors.lightgray};
  }
`;

export const Header = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.lighter};
  & h5 {
    text-align: center !important;
    margin: 0 !important;
  }
`;

export const Row = styled.div<{ big?: boolean }>`
  ${clearFix()};
  border-bottom: 1px solid ${props => props.theme.colors.lighter};
  height: ${props => (props.big ? '180px' : 'auto')};
  display: flex;
  padding: 20px;
  & textarea {
    height: 120px;
  }
  & label {
    width: 200px;
    line-height: 40px;
    ${media.lessThan('medium')`
    width: 100%;
  `};
  }

  ${media.lessThan('medium')`
    display: block;

  `};
`;

interface Props {
  closeModal: () => unknown;
}

const Modal: React.FC<Props> = ({ closeModal, children }) => {
  return (
    <>
      <Background onClick={closeModal} />
      <Dialog>
        <Action>
          <Close onClick={closeModal}>
            <X color="#fff" size={16} />
          </Close>
        </Action>
        <Content>{children}</Content>
      </Dialog>
    </>
  );
};

export default Modal;
