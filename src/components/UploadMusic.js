import React, { useState, useRef } from "react";
import styled from "styled-components";
import "../assets/styles/app.css";
import { BsPlusSquare } from "react-icons/bs";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as mmb from "music-metadata-browser";
import { Buffer } from "buffer";
import * as process from "process";

if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = process;
}

if (typeof window !== "undefined" && typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}

const UploadButton = (props) => {
  return (
    <Button onClick={props.onClick} title="Upload Songs">
      <BsPlusSquare />
    </Button>
  );
};

function UploadMusic() {
  const [newSong, setNewSong] = useState([]);

  const inputRef = useRef(null);

  // const [parseResults, setParseResults] = useState([]);

  // const onChangeHandler = async (e) => {
  //   setParseResults([]);
  //   for (const file of e.target.files) {
  //     const parseResult = {
  //       file: file,
  //     };
  //     setParseResults(parseResults.push(parseResult));
  //     try {
  //       const metadata = await parseFile(file);
  //       setParseResults(
  //         (parseResults[parseResults.length - 1].metadata = metadata)
  //       );
  //       return parseResults;
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };
  const uploadMusic = async (e) => {
    const storage = getStorage();
    const songsRef = ref(storage, "songs/" + newSong.name);
    setNewSong([]);
    for (const file of e.target.files) {
      const song = {
        file: file,
      };
      setNewSong(newSong.push(song));
      try {
        const metadata = await parseFile(file);
        setNewSong((newSong[newSong.length - 1].metadata = metadata));
        return newSong;
      } catch (err) {
        console.log(err);
      }
    }
    uploadBytes(songsRef, newSong).then((snapshot) => {
      console.log(snapshot);
    });
  };

  async function parseFile(file) {
    return mmb.parseBlob(file).then((metadata) => {
      console.log(file);
      console.log(metadata.format.duration);
      return metadata;
    });
  }

  const handleClick = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      <div className="playlist"></div>
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
`;
