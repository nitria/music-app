import React, { createContext, useState, useContext } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
const storage = getStorage();

export const AppContext = createContext();
export function useAppContext() {
  return useContext(AppContext);
}
const AppContextProvider = (props) => {
  const [users, setUsers] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSong, setSelectedSong] = useState();
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedSongTitle, setSelectedSongTitle] = useState();
  const [songDuration, setSongDuration] = useState(0);
  const [songCurrentTime, setSongCurrentTime] = useState(0);

  //Select song from list
  const selectSong = (e, index, url, name) => {
    setSelectedSong(index);
    setSelectedUrl(url);
    setSelectedSongTitle(name);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        password,
        setPassword,
        email,
        setEmail,
        selectedSong,
        setSelectedSong,
        selectedUrl,
        setSelectedUrl,
        selectSong,
        selectedSongTitle,
        songDuration,
        setSongDuration,
        songCurrentTime,
        setSongCurrentTime,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
