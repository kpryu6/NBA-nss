import React from "react";

function Photo({ url, name }) {
  return <img src={url} alt={name} width="256px" height="190px" />;
}

export default Photo;
