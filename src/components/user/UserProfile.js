import React, { useState, useRef } from "react";
import styled from "styled-components";
import "../../assets/styles/app.css";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { db } from "../../firebase";
import { BsXCircle } from "react-icons/bs";
import { getAuth, updateProfile, deleteUser, signOut } from "firebase/auth";

function UserProfile({ navigate }) {
  const [newUserName, setNewUserName] = useState("");
  const [newUserAvatar, setNewUserAvatar] = useState("");
  const userAvatarRef = useRef();
  const auth = getAuth();
  const authUser = auth.currentUser;
  const userDoc = doc(db, "users", "user");

  //Function to send updated data to firebase//
  function updateUser(e) {
    e.preventDefault();
    const storage = getStorage();
    const imageRef = ref(storage, "images/" + newUserAvatar.name);
    //If no image is uploaded just update name
    if (newUserAvatar === "") {
      updateDoc(userDoc, { displayName: newUserName });
    } else {
      //Upload image
      uploadBytes(imageRef, newUserAvatar).then((snapshot) => {
        // Let's get a download URL for the file.
        getDownloadURL(snapshot.ref)
          .then((url) => {
            //Update user profile.
            updateProfile(auth.currentUser, {
              displayName: newUserName,
              photoURL: url,
            })
              .then(() => {
                updateDoc(userDoc, { displayName: newUserName, photoURL: url });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }

    //Reset inputs//
    setNewUserName("");
    userAvatarRef.current.value = "";
    setNewUserAvatar(null);
  }

  //Close Profile and return to main//
  const closeProfile = () => {
    navigate("/main");
  };

  //Delete Account//
  const deleteAccount = () => {
    sessionStorage.removeItem("Auth ID", authUser.uid);
    signOut(auth).then(() => {
      deleteDoc(userDoc);
      navigate("/register");
      deleteUser(authUser)
        .then(() => {
          console.log("user deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  return (
    <StyledFormContainer>
      <StyledForm>
        <CloseIcon onClick={closeProfile} />
        <StyledInputContainer>
          <label htmlFor="userAvatar">Change profile image </label>
          <StyledInputs
            id="userAvatar"
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => setNewUserAvatar(e.target.files[0])}
            ref={userAvatarRef}
          />
          <p>*Accepted images .png, .jpg, .jpeg</p>
        </StyledInputContainer>

        <StyledInputContainer>
          <label htmlFor="userName">Change profile name</label>
          <StyledInputs
            id="userName"
            type="text"
            placeholder="Enter your Name"
            required
            onChange={(e) => setNewUserName(e.target.value)}
            value={newUserName}
          />
        </StyledInputContainer>
        <Button type="submit" onClick={updateUser}>
          Update
        </Button>
      </StyledForm>
      <StyledDeleteContainer>
        <h2>Delete account</h2>
        <Button type="submit" danger onClick={deleteAccount}>
          Delete Account
        </Button>
      </StyledDeleteContainer>
    </StyledFormContainer>
  );
}

export default UserProfile;

const StyledFormContainer = styled.div`
  height: 100%;
`;
const CloseIcon = styled(BsXCircle)`
  align-self: flex-end;
  cursor: pointer;
  font-size: 1.1rem;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  max-width: 250px;
  width: 100%;
  height: auto;
  margin: 4rem auto 0;
`;

const StyledInputContainer = styled.div`
  margin-top: 0.8rem;
  margin-bottom: 2rem;
`;
const StyledInputs = styled.input`
  padding: 0.3rem 0.5rem;
  width: 100%;
`;

const Button = styled.button`
  font-size: 1rem;
  color: var(--white);
  background-color: ${(props) =>
    props.danger ? "#ff0000" : "var(--primaryColor)"};
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

const StyledDeleteContainer = styled.div`
  margin: 4rem auto;
  max-width: 250px;
  width: 100%;
`;
