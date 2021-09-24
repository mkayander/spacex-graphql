import styled from "styled-components";

const Spinner = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 80px;
  width: 80px;

  z-index: 1000;

  &:after {
    content: "";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid;
    border-color: #fcf #fcf #fcf transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
