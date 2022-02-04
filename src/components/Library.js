import React, { useState, useRef } from "react";
import styled from "styled-components";
import "../assets/styles/app.css";
import UploadMusic from "./UploadMusic";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
// import * as mmb from "music-metadata-browser";
import { Buffer } from "buffer";
import * as process from "process";
import { useAppContext } from "../context/useContext";

if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = process;
}

if (typeof window !== "undefined" && typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}

const storage = getStorage();
const songArray = [];
const getSongsFromServer = ref(storage, "songs/");
async function getList() {
  await listAll(getSongsFromServer).then((res) => {
    res.items.forEach((item) => {
      var songInfo = {};
      getDownloadURL(item).then((url) => {
        songInfo = {
          audioName: item.name,
          audioUrl: url,
        };
        songArray.push(songInfo);
      });
    });
  });
}

getList();

function Library() {
  const [parseResults, setParseResults] = useState([]);
  const [getSongs, setGetSongs] = useState(songArray);
  const { selectSong, selectedSong } = useAppContext();
  const inputRef = useRef(null);
  const uploadMusic = async (e) => {
    setParseResults([]);
    for (const file of e.target.files) {
      const parseResult = {
        file: file,
      };
      const songsRef = ref(storage, "songs/" + parseResult.file.name);
      uploadBytes(songsRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          return url;
        });
      });
      setParseResults(parseResult);
    }
  };

  const handleClick = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  return (
    <StyledLibraryDiv>
      <div className="songsList">
        <ul>
          {getSongs.map((item, index) => {
            return (
              <StyledList
                title={item.audioName}
                className={`${selectedSong === index ? "active" : ""}`}
                key={index}
                onClick={(e) => {
                  selectSong(e, index, item.audioUrl, item.audioName);
                }}
              >
                {item.audioName}
              </StyledList>
            );
          })}
        </ul>
      </div>
      <UploadMusic
        handleClick={handleClick}
        uploadMusic={uploadMusic}
        inputRef={inputRef}
      />
    </StyledLibraryDiv>
  );
}

export default Library;

const StyledLibraryDiv = styled.div`
  flex-grow: 1;
  border-left: 1px solid var(--darkwhite);
  height: 100%;
  max-width: 300px;
  padding: 1rem 0;
`;
const StyledList = styled.li`
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: default;
  user-select: none;
  &.active,
  &:hover {
    background-color: var(--primaryColor);
  }
`;
