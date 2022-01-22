import React from "react";
import styled from "styled-components";
import "../assets/styles/app.css";
import { BsPlusSquare } from "react-icons/bs";

const UploadButton = (props) => {
  return (
    <Button onClick={props.onClick} title="Upload Songs">
      <BsPlusSquare />
    </Button>
  );
};

function UploadMusic({ handleClick, uploadMusic, inputRef }) {
  return (
    <div>
      <input
        type="file"
        accept=".mp3, .wav, .ogg"
        onChange={(e) => uploadMusic(e)}
        hidden
        ref={inputRef}
      />
      <UploadButton onClick={() => handleClick()} />
    </div>
  );
}

export default UploadMusic;

const Button = styled(BsPlusSquare)`
  font-size: 1rem;
  color: var(--darkwhite);
  border: none;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
`;
