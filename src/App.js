import React, { useEffect } from "react";
import styled from "styled-components";
import "./assets/styles/app.css";
import User from "./components/user/User";
import SearchBar from "./components/SearchBar";
import ControlButtons from "./components/ControlButtons";
import Main from "./components/Main";
import UserProfile from "./components/user/UserProfile";
import UserSettings from "./components/user/UserSettings";
import Form from "./components/user/Form";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAppContext } from "./context/useContext";

function App() {
  const { users, setUsers, password, setPassword, email, setEmail } =
    useAppContext();

  let navigate = useNavigate();

  //If user is authenticate go to main else to register
  useEffect(() => {
    const auth = getAuth();
    const authID = sessionStorage.getItem("Auth ID", auth.uid);

    if (authID) {
      navigate("/main");
    }
    if (!authID) {
      navigate("/register");
    }
    return () => {
      if (authID) {
        navigate("/main");
      }
      if (!authID) {
        navigate("/register");
      }
    };
  }, []);

  return (
    <StyledContainer className="App">
      <StyledHeader>
        <SearchBar />
        <User
          users={users}
          setUsers={setUsers}
          navigate={navigate}
          email={email}
        />
      </StyledHeader>
      <StyledMainContainer>
        <Routes>
          <Route
            path="/profile"
            element={<UserProfile navigate={navigate} />}
          />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/main" element={<Main navigate={navigate} />} />
          <Route
            path="/login"
            element={
              <Form
                title="Login"
                setEmail={setEmail}
                setPassword={setPassword}
                email={email}
                password={password}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Form
                title="Register"
                setEmail={setEmail}
                setPassword={setPassword}
                email={email}
                password={password}
              />
            }
          />
        </Routes>
      </StyledMainContainer>
      <ControlButtons />
    </StyledContainer>
  );
}

export default App;

const StyledContainer = styled.div`
  background-color: var(--bgColor);
  color: white;
  height: 100vh;
  font-family: arial, helvetica, sans-serif;
`;
const StyledHeader = styled.header`
  display: flex;
  width: 100%;
  background-color: var(--lightprimaryColor);
  padding: 1rem;
`;
const StyledMainContainer = styled.main`
  width: 100%;
  height: 90%;
  position: relative;
`;

// const StyledFooter = styled(StyledHeader)``;
