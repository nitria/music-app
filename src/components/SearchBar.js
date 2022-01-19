import React from "react";
import styled from "styled-components";
import "../assets/styles/app.css";
import { BsSearch } from "react-icons/bs";

const StyledSearchBarComponent = styled.div`
  flex-grow: 4;
  text-align: center;
`;
const StyledSearchBox = styled.div`
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
`;
const StyledInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--darkwhite);
  width: 90%;
  padding: 0.3rem 0.5rem;
  font-size: 1rem;
  color: var(--white);
  display: inline-block;
`;
const BsSearchIcon = styled(BsSearch)`
  display: inline-block;
  vertical-align: middle;
`;

function SearchBar() {
  return (
    <StyledSearchBarComponent>
      <StyledSearchBox>
        <StyledInput
          type="search"
          className="search"
          id="search"
          placeholder="Search a song"
        />
        <BsSearchIcon />
      </StyledSearchBox>
    </StyledSearchBarComponent>
  );
}

export default SearchBar;
