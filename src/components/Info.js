import React from "react";
import "../styles/Info.css";
import Icon from "./Icon";

const Info = ({ className = "", style = {} }) => {
  return (
    <div style={{ ...style }} className={className}>
      <div className="info_image mx-auto mx-md-0"></div>
      <div className="text-start">
        <p className="info_p my-2 info_fullname text-center text-md-start">
          Tran Thien Phu
        </p>
        <p className="info_p my-2">
          <Icon icon="map-marker-alt" />
          <span className="ms-2">O Mon, Can Tho, Viet Nam</span>
        </p>
        <p className="info_p my-2">
          <Icon icon="mobile-alt" />
          <span className="ms-2">0763883037</span>
        </p>
        <p className="info_p my-2">
          <Icon icon="envelope" />
          <span className="ms-2">phutt2201@gmail.com</span>
        </p>
        <p className="info_p my-2">
          <Icon icon={["fab", "github"]} />
          <a
            href="https://github.com/marshmary"
            target="_blank"
            rel="noreferrer"
            className="ms-2"
          >
            https://github.com/marshmary
          </a>
        </p>
        <p className="info_p my-2">
          I'm a web developer <br></br> I'm really into UI design and working
          with API
        </p>
      </div>
    </div>
  );
};

export default Info;
