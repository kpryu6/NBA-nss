import React from "react";
import "../css/Charts/StatBox.css";

function StatBox({ stat }) {
  const statsMap = {
    points_per_game: "Points Per Game",
    assists_per_game: "Assists",
    blocks_per_game: "Blocks",
    three_point_percentage: "Three Point Percentage",
    field_goal_percentage: "Field Goal Percentage",
    rebounds_per_game: "Rebounds",
  };

  const label = statsMap[stat.label];
  const value = stat.label.includes("percentage")
    ? `${stat.value}%`
    : stat.value;

  return (
    <div className="Outer">
      <div className="StatRow">
        <span className="StatLabel">{label}</span>
        <p className="StatValue">{value}</p>
      </div>
    </div>
  );
}

export default StatBox;
