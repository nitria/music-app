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
import * as mmb from "music-metadata-browser";
import { Buffer } from "buffer";
import * as process from "process";

if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = process;
}

if (typeof window !== "undefined" && typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}

function Library() {
  const [parseResults, setParseResults] = useState([]);
  const [getSongs, setGetSongs] = useState([]);
  const inputRef = useRef(null);

  const uploadMusic = async (e) => {
    const storage = getStorage();

    setParseResults([]);

    for (const file of e.target.files) {
      const parseResult = {
        file: file,
      };
      const songsRef = ref(storage, "songs/" + parseResult.file.name);
      uploadBytes(songsRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          const songInfo = {
            audioUrl: url,
            audioName: snapshot.ref.name,
          };
          setGetSongs([songInfo]);
        });
      });
      setParseResults(parseResults.push(parseResult));
      try {
        const metadata = await parseFile(file);
        setParseResults(
          (parseResults[parseResults.length - 1].metadata = metadata)
        );
        return parseResults;
      } catch (err) {
        console.log(err);
      }
    }
  };

  async function parseFile(file) {
    return mmb.parseBlob(file).then((metadata) => {
      console.log(file.name);
      return metadata;
    });
  }

  const handleClick = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  const playSong = (e, url) => {
    const song = new Audio(url);
    song.play();
  };

  return (
    <StyledLibraryDiv>
      <div className="songsList">
        <ul>
          {getSongs.map((getSong, index) => {
            return (
              <li
                key={index}
                onClick={(e) => {
                  playSong(e, getSong.audioUrl);
                }}
              >
                {getSong.audioName}
              </li>
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
`;
