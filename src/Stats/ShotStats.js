import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";

import { GrSearch } from "react-icons/gr";
import "../css/Stats/ShotStats.css";

const ShotStats = () => {
  const [shotData, setShotData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchValue, setSearchValue] = useState("");
  const [filteredshots, setFilteredshots] = useState([]);

  // 파드 리스트
  useEffect(() => {
    const test = Array.from({ length: 28 }, (_, i) => ({
      id: i + 1,
      name: `James${(i % 2) + 1}`,
      shot1: "58.8%",
      shot2: "82.7%",
    }));
    setShotData(test);
  }, []);

  //파드 검색
  useEffect(() => {
    const filtered = shotData.filter((shot) =>
      shot.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredshots(filtered);
    setCurrentPage(1);
  }, [searchValue, shotData]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredshots.slice(indexOfFirstItem, indexOfLastItem);

  const renderRow = (shot) => {
    return (
      <React.Fragment key={shot.id}>
        <td>{shot.id}</td>
        <td>{shot.name}</td>
        <td>{shot.shot1}</td>
        <td>{shot.shot2}</td>

        <td>{shot.shot1}</td>
        <td>{shot.shot2}</td>

        <td>{shot.shot1}</td>
      </React.Fragment>
    );
  };

  return (
    <div className="stat-list">
      <h1 className="stat-title">Shot Stats</h1>

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
            <th>NAME</th>
            <th>Less than 5 FT.</th>
            <th>5~9 FT.</th>
            <th>10~14 FT.</th>
            <th>15~19 FT.</th>
            <th>Over 19 FT.</th>
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

export default ShotStats;
