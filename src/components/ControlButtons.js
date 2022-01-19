import React from "react";
import styled, { css } from "styled-components";
import "../assets/styles/app.css";
import {
  BsPlayCircle,
  BsPauseCircle,
  BsSkipBackwardCircle,
  BsSkipForwardCircle,
} from "react-icons/bs";
// import { BiSkipPreviousCircle, BiSkipNextCircle } from "react-icons/bi";

const ControlButtonsDiv = styled.div`
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: row;
`;
const sharedStyles = css`
  border-radius: 50%;
  color: var(--white);
  opacity: 0.7;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 1;
    background: var(--darkprimaryColor);
  }
`;
const PrimaryIcons = styled(BsPlayCircle, BsPauseCircle)`
  ${sharedStyles}
  font-size: 3rem;
`;
const SecondaryIcons = css`
  ${sharedStyles}
  font-size: 2rem;
`;
const PrevIcon = styled(BsSkipBackwardCircle)`
  ${SecondaryIcons}
`;
const NextIcon = styled(BsSkipForwardCircle)`
  ${SecondaryIcons}
`;

function ControlButtons() {
  return (
    <ControlButtonsDiv className="controlButtons">
      <PrevIcon />
      {<PrimaryIcons />}

      <NextIcon />
    </ControlButtonsDiv>
  );
}

export default ControlButtons;
