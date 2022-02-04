import React from "react";
import styled from "styled-components";
import "../assets/styles/app.css";
import SongDetails from "./SongDetails";
import Library from "./Library";

function Main({ playSong, selectSong, navigate, selectedSong }) {
  return (
    <StyledMain>
      <SongDetails />
      <Library
        playSong={playSong}
        selectSong={selectSong}
        navigate={navigate}
        selectedSong={selectedSong}
      />
    </StyledMain>
  );
}

export default Main;

const StyledMain = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;
