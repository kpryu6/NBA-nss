import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import axios from "axios";
import { GrSearch } from "react-icons/gr";
import "../css/Stats/Stats.css";
import { useDispatch } from "react-redux";

import ShotChart from "../Charts/ShotChart";
const Stats = () => {
  const dispatch = useDispatch();
  const [shotData, setShotData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchValue, setSearchValue] = useState("");
  const [filteredshots, setFilteredshots] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: "https://free-nba.p.rapidapi.com/stats",
        params: {
          page: "5",
          per_page: "25",
        },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_NBA_API_STATS_KEY,
          "X-RapidAPI-Host": "free-nba.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setShotData(response.data.data);
        dispatch({ type: "SET_SHOT_DATA", payload: response.data.data });

        console.log(shotData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  //선수 검색
  useEffect(() => {
    const filtered = shotData.filter((shot) =>
      shot.player.first_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredshots(filtered);
    setCurrentPage(1);
  }, [searchValue, shotData]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredshots.slice(indexOfFirstItem, indexOfLastItem);

  console.log(shotData);
  const renderRow = (shot) => {
    const getDisplayValue = (value) => {
      return value !== 0 ? value : "-";
    };

    return (
      <React.Fragment key={shot.id}>
        <td>{shot.id}</td>
        <td>{getDisplayValue(shot.team.full_name)}</td>
        <td>
          {getDisplayValue(
            shot.player.first_name + " " + shot.player.last_name
          )}
        </td>
        <td>{getDisplayValue(shot.ast)}</td>
        <td>{getDisplayValue(shot.reb)}</td>
        <td>{getDisplayValue(shot.pts)}</td>
        <td>{getDisplayValue(shot.stl)}</td>
        <td>{getDisplayValue(shot.fg3m)}</td>
        <td>{getDisplayValue(shot.fg3a)}</td>
        <td>{getDisplayValue(shot.fgm)}</td>
        <td>{getDisplayValue(shot.fga)}</td>
        <td>{getDisplayValue(shot.fg_pct)}</td>
        <td>{getDisplayValue(shot.turnover)}</td>
      </React.Fragment>
    );
  };

  return (
    <div className="stat-list">
      <h1 className="stat-title">Player Stats</h1>

      <div className="up-table">
        <div className="search-box">
          <GrSearch size="30" />
          <input
            type="text"
            placeholder="Type in to Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="per-page-select">
          <label className="per-page">Show</label>
          <select
            id="per-page"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead className="table-head">
          <tr>
            <th>#</th>
            <th>TEAM</th>
            <th>NAME</th>
            <th>AST</th>
            <th>REB</th>
            <th>PTS</th>
            <th>STL</th>
            <th>FG3M</th>
            <th>FG3A</th>
            <th>FGM</th>
            <th>FGA</th>
            <th>FGP</th>
            <th>TO</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((shot) => (
            <tr key={shot.id}>{renderRow(shot)}</tr>
          ))}
        </tbody>
      </table>

      <div className="PaginationBox">
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={shotData.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        ></Pagination>
      </div>
    </div>
  );
};

export default Stats;
