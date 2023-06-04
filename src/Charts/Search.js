import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

function Search({ searchTerm, setSearchTerm, searchPlayer }) {
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search Player Name"
      />
      <SearchButton onClick={searchPlayer}>
        <FaSearch size={17} />
      </SearchButton>
    </SearchContainer>
  );
}

export default Search;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  max-width: 625px;
  margin: 10px auto 25px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 14px 20px;
  border: 3px solid #f9f9f9;
  color: #8d96aa;
  font-size: 15px;
  width: 100%;
  border-radius: 6px 0px 0px 6px;
  flex: 1;
`;

const SearchButton = styled.button`
  background-color: #1f6bef;
  padding: 14px 20px;
  border: none;
  border-radius: 0px 6px 6px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;
