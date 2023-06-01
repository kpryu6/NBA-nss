import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import logo from "../images/nba-logo.svg";
const StyledHeader = styled.header`
  background-color: #000000;
  width: 100%;
  padding: 10px 12px 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  .nav_logo {
    padding: 0 12px;
    .nav-logo-link {
      text-decoration: none;
      font-size: 35px;
      color: #ffffff;
      font-weight: bold;
    }
  }
  .menuToggleBtn {
    display: none;
    color: white;
    font-size: 30px;
    position: absolute;
    right: 30px;
    top: 20px;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    .menuToggleBtn {
      display: block;
    }
  }
`;
const NavMenu = styled.ul`
  list-style: none;
  display: flex;

  li {
    margin-right: 100px;
    &:hover {
      cursor: pointer;
      background: #fff;
      border-radius: 4px;
    }
    &:hover > .nav-menu-list {
      color: #000000; /* 텍스트 색상을 흰색으로 지정 /
    font-weight: bold; / 텍스트를 진하게 지정 */
    }
  }

  .nav-menu-list {
    font-size: 20px;
    text-decoration: none;
    color: white;
    display: block;
    padding: 10px;
  }
  @media screen and (max-width: 768px) {
    display: ${(props) => (props.isToggleOpen ? "block" : "none")};
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 10px;
  }
`;

const Sidebar = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const handleToggleOpen = () => {
    setIsToggleOpen(!isToggleOpen);
  };
  return (
    <>
      <StyledHeader>
        <div className="nav_logo">
          <Link to={"/news"} className="nav-logo-link">
            <img src={logo} className="App-logo" alt="logo" /> {"  "}Shot Charts
          </Link>
        </div>

        <NavMenu isToggleOpen={isToggleOpen}>
          <li>
            <Link to={"/news"} className="nav-menu-list">
              News
            </Link>
          </li>
          <li>
            <Link to={"/stats"} className="nav-menu-list">
              Stats
            </Link>
          </li>
          <li>
            <Link to={"/charts"} className="nav-menu-list">
              Charts
            </Link>
          </li>
        </NavMenu>
        <FaBars className="menuToggleBtn" onClick={handleToggleOpen} />
      </StyledHeader>
    </>
  );
};

export default Sidebar;
