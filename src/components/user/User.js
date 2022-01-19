import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../../assets/styles/app.css";
import { FaUserCircle } from "react-icons/fa";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { signOut, getAuth } from "firebase/auth";

function User({
  users,
  setUsers,
  navigate,
  email,
  dropdown,
  setDropdown,
  dropdownRef,
}) {
  const auth = getAuth();
  const authUser = auth.currentUser;

  //Function to open user dropdown menu//
  const expandDropdown = () => {
    setDropdown(!dropdown);
  };

  //Function to logout user//
  const handleLogout = () => {
    sessionStorage.removeItem("Auth ID", authUser.uid);
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    //Function to get updated data from firebase//
    const getUpdatedData = async () => {
      onSnapshot(doc(db, "users", "user"), (doc) => {
        setUsers(doc.data());
      });
    };
    getUpdatedData();
    return () => {
      getUpdatedData();
    };
  }, [setUsers]);
  return (
    <StyledUser>
      <div>
        <StyledAvatar onClick={() => expandDropdown()}>
          {authUser && users !== undefined && users.photoURL.length > 1 ? (
            <img
              src={users.photoURL}
              alt={users.displayName}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <UserIcon />
          )}
        </StyledAvatar>
        <StyledUserName>
          {authUser && users !== undefined && users.displayName.length > 1
            ? users.displayName
            : authUser && email}
        </StyledUserName>
        <div
          className={`dropdown ${dropdown ? "active" : ""}`}
          ref={dropdownRef}
        >
          <Link to="profile">Profile</Link>
          <Link to="settings">Settings</Link>
          <button onClick={handleLogout}>
            {authUser ? "logout" : "login"}
          </button>
        </div>
      </div>
    </StyledUser>
  );
}

export default User;

const StyledUser = styled.div`
  flex-grow: 1;
  position: relative;
`;

const StyledAvatar = styled.div.attrs((props) => ({
  className: props.className,
}))`
  width: 40px;
  height: 40px;
  display: inline-block;
  cursor: pointer;
`;

const UserIcon = styled(FaUserCircle)`
  width: 100%;
  height: 100%;
  color: var(--darkwhite);
  cursor: pointer;
`;

const StyledUserName = styled.h1`
  display: inline-block;
  margin-left: 1rem;
`;
