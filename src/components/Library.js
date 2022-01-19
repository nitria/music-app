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
  const inputRef = useRef(null);
  const storage = getStorage();
  const uploadMusic = async (e) => {
    const storage = getStorage();

    setParseResults([]);

    for (const file of e.target.files) {
      const parseResult = {
        file: file,
      };

      setParseResults(parseResults.push(parseResult));
      try {
        const metadata = await parseFile(file);
        setParseResults(
          (parseResults[parseResults.length - 1].metadata = metadata)
        );

        const songsRef = ref(storage, "songs/" + parseResult.file.name);
        uploadBytes(songsRef, parseResult).then((snapshot) => {});
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

  // Create a reference under which you want to list
  const listRef = ref(storage, "songs/");
  const htmlParse = [];
  // Find all the prefixes and items.
  listAll(listRef)
    .then((res) => {
      // res.prefixes.forEach((folderRef) => {
      //   // All the prefixes under listRef.
      //   // You may call listAll() recursively on them.
      //   console.log(folderRef);
      // });

      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          console.log(url);
          console.log(itemRef.name);
          htmlParse.push(
            <li>
              {itemRef.name}
              <audio src={url} />
            </li>
          );
        });
      });
      // });
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <StyledLibraryDiv>
      <div className="songsList">
        <ul>{htmlParse}</ul>
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
