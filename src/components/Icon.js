import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "../styles/Icon.css";

library.add(fas);
library.add(fab);

const Icon = (props) => {
  return <FontAwesomeIcon {...props} className="fa-fw" />;
};

export default Icon;
