import React, { useState } from "react";

import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

// import { getPlayer } from "../store/actions/player";

function Search(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const searchPlayer = (e) => {
    const playerName = searchTerm.split(" ");
    const firstName = playerName[0];
    const surname = playerName[1];
    e.preventDefault();
    if (firstName && surname) {
      // if both exist, pass the searchTerm to our action creator.
      // props.getPlayer(firstName, surname);
    } else {
      // otherwise let the user know we'll need more than a first name.
      setError("Search requires a first and last name.");
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={searchPlayer}>
      <SearchWrapper>
        <SearchBar
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search player name"
        />
        <SearchButton type="submit">
          <FaSearch size={17} />
        </SearchButton>
      </SearchWrapper>
      {error && <Error>{error}</Error>}
    </form>
  );
}

export default Search;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  width: 625px;
  margin: 10px auto 25px;
  align-items: center;
`;

const SearchBar = styled.input`
  padding: 14px 20px;
  border: 3px solid #f9f9f9;
  color: #8d96aa;
  font-size: 15px;
  width: 250px;
  border-radius: 6px 0px 0px 6px;
  flex: 7;
`;

const SearchButton = styled.button`
  background-color: #1f6bef;
  padding: 14px 20px;
  border: none;
  border-radius: 0px 6px 6px 0px;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const Error = styled.span`
  color: red;
  padding: 5px;
  display: block;
  font-size: 12px;
`;
