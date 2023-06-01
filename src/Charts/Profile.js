import React from "react";

import StatBox from "./StatBox";
import Photo from "./Photo";

function Profile() {
  const name = "Lebron James"; // Replace with appropriate data source
  const image = "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png"; // Replace with appropriate data source
  const stats = [
    { label: "points_per_game", value: 25.5 },
    { label: "assists_per_game", value: 6.7 },
    { label: "blocks_per_game", value: 7.9 },
    { label: "three_point_percentage", value: 31.5 },
    { label: "field_goal_percentage", value: 54.7 },
    { label: "rebounds_per_game", value: 8.8 },
  ];

  const statBoxList =
    stats && stats.map((stat) => <StatBox stat={stat} key={stat.label} />);

  return (
    <div className="ProfileBox">
      <div className="Outer">
        <div className="ImageWrapper">
          {image && <Photo url={image} name={name} />}
        </div>
        <div className="StatsWrapper">{statBoxList}</div>
      </div>
    </div>
  );
}

export default Profile;
