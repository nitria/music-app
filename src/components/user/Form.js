import React from "react";
import styled from "styled-components";
import "../../assets/styles/app.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase";

function Form({ title, email, setEmail, password, setPassword }) {
  let navigate = useNavigate();

  //Function to Register/Login //
  const registerOrLogin = (e) => {
    e.preventDefault();
    const authentication = getAuth();
    //Register user
    if (title === "Register") {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          const user = response.user;
          setDoc(doc(db, "users", "user"), {
            displayName: "",
            photoURL: "",
          });
          navigate("/main");
          sessionStorage.setItem("Auth ID", user.uid);
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            toast.error("Email Already in Use");
          }
        });
    }
    //Login user
    if (title === "Login") {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          const user = response.user;
          navigate("/main");
          sessionStorage.setItem("Auth ID", user.uid);
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            toast.error("Please check the Password");
          }
          if (error.code === "auth/user-not-found") {
            toast.error("Please check the Email");
          }
        });
    }
  };
  return (
    <StyledFormContainer>
      <StyledForm>
        <StyledTitle>{title}</StyledTitle>
        <StyledInputs
          type="text"
          label="Enter your Email"
          placeholder="Enter your Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledInputs
          type="password"
          label="Enter your Password"
          placeholder="Enter your Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <StyledButton onClick={(e) => registerOrLogin(e)}>{title}</StyledButton>
        <StyledLink to={title === "Register" ? "/login" : "/register"}>
          {title === "Register" ? "Login" : "Register"}
        </StyledLink>
      </StyledForm>
      <ToastContainer />
    </StyledFormContainer>
  );
}

export default Form;

const StyledFormContainer = styled.div`
  height: 100%;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  max-width: 250px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;

const StyledTitle = styled.h1`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const StyledInputs = styled.input`
  margin-bottom: 1rem;
  padding: 0.3rem 0.5rem;
  width: 100%;
`;

const StyledButton = styled.button`
  background-color: var(--lightprimaryColor);
  color: var(--white);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  color: var(--white);
  cursor: pointer;
`;
