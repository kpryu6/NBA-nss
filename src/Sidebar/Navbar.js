import React from "react";
import Sidebar from "./Sidebar";
import { Routes, Route } from "react-router-dom";
import News from "../News/News";
import Stats from "../Stats/Stats";

import ShotCharts from "../Charts/ShotChart";

function Navbar() {
  return (
    <div className="NavbarComponent">
      <Sidebar />
      <Routes>
        <Route path="/news" element={<News />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/charts" element={<ShotCharts />} />
      </Routes>
    </div>
  );
}

export default Navbar;
