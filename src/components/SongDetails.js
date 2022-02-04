import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../assets/styles/app.css";
import Wave from "@foobar404/wave";

function SongDetails() {
  let [wave] = useState(new Wave());

  useEffect(() => {
    wave.fromElement("song", "output", {
      type: "dualbars",
      colors: ["#8e05c2"],
    });
  }, []);

  return (
    <StyledSongDetailsDiv>
      <StyledCanvas id="output"></StyledCanvas>
    </StyledSongDetailsDiv>
  );
}

export default SongDetails;

const StyledSongDetailsDiv = styled.div`
  position: relative;
  flex-grow: 4;
`;
const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;
