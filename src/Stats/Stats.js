import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import axios from "axios";
import { GrSearch } from "react-icons/gr";
import "../css/Stats/Stats.css";

const Stats = () => {
  const [shotData, setShotData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchValue, setSearchValue] = useState("");
  const [filteredshots, setFilteredshots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: "https://free-nba.p.rapidapi.com/stats",
        params: {
          page: "0",
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
        console.log(response.data.data);
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

  const renderRow = (shot) => {
    const getDisplayValue = (value) => {
      return value !== null ? value : "-";
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
        <td>{getDisplayValue(shot.dreb)}</td>
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
