import React from "react";

import StatBox from "./StatBox";

function Profile(props) {
  const { name, stats } = props;

  const statBoxList =
    stats && stats.map((stat) => <StatBox stat={stat} key={stat.label} />);

  return (
    <div className="ProfileBox">
      <div className="Outer">
        <div className="ImageWrapper"></div>
        <div className="StatsWrapper">{statBoxList}</div>
      </div>
    </div>
  );
}

export default Profile;
