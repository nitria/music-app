import React, { useState, useRef, useEffect } from "react";
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
const songsArray = [];
function Library() {
  const [parseResults, setParseResults] = useState([]);
  const [getSongs, setGetSongs] = useState(songsArray);
  const inputRef = useRef(null);
  const storage = getStorage();

  const uploadMusic = async (e) => {
    setParseResults([]);

    for (const file of e.target.files) {
      const parseResult = {
        file: file,
      };
      const songsRef = ref(storage, "songs/" + parseResult.file.name);
      uploadBytes(songsRef, file).then((snapshot) => {
        // getDownloadURL(snapshot.ref).then((url) => {
        //   const songInfo = {
        //     audioUrl: url,
        //     audioName: snapshot.ref.name,
        //   };
        //   setGetSongs([songInfo]);
        // });
      });
      setParseResults(parseResult);
      // try {
      //   const metadata = await parseFile(file);
      //   setParseResults(
      //     (parseResults[parseResults.length - 1].metadata = metadata)
      //   );
      //   return parseResults;
      // } catch (err) {
      //   console.log(err);
      // }
    }
  };

  // async function parseFile(file) {
  //   return mmb.parseBlob(file).then((metadata) => {
  //     return metadata;
  //   });
  // }

  const handleClick = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  const playSong = (url) => {
    const song = new Audio(url);
    song.play();
  };

  useEffect(() => {
    const getSongsFromServer = ref(storage, "songs/");

    const getList = () => {
      listAll(getSongsFromServer).then((res) => {
        res.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            const songInfo = {
              audioName: item.name,
              audioUrl: url,
            };
            songsArray.push(songInfo);
          });
        });
      });
    };
    getList();
    setGetSongs(songsArray);
    return () => {
      getList();
    };
  }, [storage]);

  return (
    <StyledLibraryDiv>
      <div className="songsList">
        <ul>
          {getSongs.map((song, index) => {
            return (
              <li key={index} onDoubleClick={playSong(song.audioUrl)}>
                {song.audioName}
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
  max-width: 300px;
  padding: 1rem;
`;
