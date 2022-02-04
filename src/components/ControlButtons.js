import React, { useState, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import "../assets/styles/app.css";
import {
  BsPlayCircle,
  BsPauseCircle,
  BsSkipBackwardCircle,
  BsSkipForwardCircle,
  BsVolumeUp,
  BsVolumeDown,
  BsVolumeMute,
} from "react-icons/bs";
import { useAppContext } from "../context/useContext";

function ControlButtons() {
  const [volume, setVolume] = useState(0.5);
  const [speaker, setSpeaker] = useState();
  const [isPlaying, setIsplaying] = useState(false);

  const {
    selectSong,
    songCurrentTime,
    setSongCurrentTime,
    songDuration,
    setSongDuration,
    selectedUrl,
  } = useAppContext();
  const audioRef = useRef();

  const muteSong = () => {
    setVolume(0);
    setSpeaker(<BsVolumeMute />);
  };
  const unmuteSong = (prevvolume) => {
    setVolume(prevvolume);
  };

  if (audioRef.current !== undefined) {
    audioRef.current.addEventListener("timeupdate", () => {
      const currentTime =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setSongCurrentTime(currentTime);
    });
    audioRef.current.preload = "metadata";
    audioRef.current.onloadedmetadata = function () {
      setSongDuration(audioRef.current.duration);
    };
  }

  useEffect(() => {
    audioRef.current.src = selectedUrl;
  }, [selectedUrl]);

  useEffect(() => {
    selectSong();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    var prevVolume = audioRef.current.volume;
    audioRef.current.volume = volume;

    if (audioRef.current.volume === 0) {
      setSpeaker(
        <BsVolumeMute
          style={{ fontSize: "2rem" }}
          onClick={() => unmuteSong(prevVolume)}
        />
      );
    } else if (audioRef.current.volume < 0.51) {
      setSpeaker(
        <BsVolumeDown style={{ fontSize: "2rem" }} onClick={muteSong} />
      );
    } else {
      setSpeaker(
        <BsVolumeUp style={{ fontSize: "2rem" }} onClick={muteSong} />
      );
    }
  }, [volume]);

  return (
    <StyledFooter>
      <StyledProgressBarContainer>
        <StyledInput
          type="range"
          min={0}
          max={songDuration ? songDuration : `${songDuration}`}
          defaultValue={songCurrentTime || 0}
          onChange={(e) => setSongCurrentTime(+e.target.value)}
          id="progressBar"
          step={1}
        />
      </StyledProgressBarContainer>
      {/* {selectedSong && (
        <StyledSongInfoDiv>
          <img src="" alt="" />
          <h1>Now Playing...</h1>
          <StyledSongTitle>{selectedSongTitle}</StyledSongTitle>
        </StyledSongInfoDiv>
      )} */}
      <ControlButtonsDiv className="controlButtons">
        <audio
          ref={audioRef}
          id="song"
          src={selectedUrl}
          style={{ display: "none" }}
        ></audio>
        <PrevIcon />
        {/* {isPlaying ? (
          <button
            onClick={() => {
              console.log("pause");
              setIsplaying(false);
            }}
          >
            pause
          </button>
        ) : (
          <button
            onClick={() => {
              console.log("play");
              setIsplaying(true);
            }}
          >
            play
          </button>
        )} */}

        {isPlaying ? (
          <StyledButton
            onClick={() => {
              console.log("pause");
              setIsplaying(false);
            }}
          >
            <StyledPause />
          </StyledButton>
        ) : (
          <StyledButton
            onClick={() => {
              console.log("play");
              setIsplaying(true);
            }}
          >
            <StyledPlay />
          </StyledButton>
        )}

        <NextIcon />
      </ControlButtonsDiv>
      <ControlVolumeDiv>
        {speaker}
        <input
          type="range"
          min={0}
          max={1}
          defaultValue={volume}
          step={0.1}
          onChange={(e) => setVolume(+e.target.value)}
        />
      </ControlVolumeDiv>
    </StyledFooter>
  );
}

export default ControlButtons;

const slide = keyframes`
from {
  transform: translateX(0)
}
to {
  transform: translateX(-100%)
}
`;

const StyledFooter = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 1rem;
  background-color: var(--lightprimaryColor);
`;
const StyledProgressBarContainer = styled.div`
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
`;
const StyledInput = styled.input`
  width: 100%;
`;
const StyledSongInfoDiv = styled.div`
  width: 100%;
  max-width: 150px;
  margin: 0 auto;
  flex-grow: 1;
  overflow: hidden;
`;
const StyledSongTitle = styled.p`
  width: max-content;
  animation: ${slide} 20s linear infinite;
`;
const ControlButtonsDiv = styled.div`
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: row;
  flex-grow: 2;
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
const StyledButton = styled.button`
  background: transparent;
  border: none;
`;
const StyledPlay = styled(BsPlayCircle)`
  ${sharedStyles}
  font-size: 3rem;
  width: 3rem;
  height: 3rem;
`;
const StyledPause = styled(BsPauseCircle)`
  ${sharedStyles}
  font-size: 3rem;
  width: 3rem;
  height: 3rem;
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
const ControlVolumeDiv = styled(ControlButtonsDiv)`
  align-items: center;
  flex-grow: 1;
`;
