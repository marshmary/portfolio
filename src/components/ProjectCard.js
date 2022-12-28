import React from "react";
import "../styles/ProjectCard.css";

const ProjectCard = ({
  className = "",
  style = {},
  isHorizontal = false,
  cardInfo = {},
}) => {
  const card_style = {
    background: `linear-gradient(${isHorizontal ? "to right" : "to bottom"}, ${
      cardInfo.styling.colorPrimary
    }, ${cardInfo.styling.colorSecondary})`,
  };

  const button_style = {
    color: `${cardInfo.styling.colorPrimary}`,
  };

  return (
    <div
      style={{ ...card_style, ...style }}
      className={`card project_card p-3 gap-1 text-start ${className}`}
    >
      <p className="m-0">{cardInfo.info.type}</p>
      <p className="m-0 project_card_name">{cardInfo.info.name}</p>
      <p className="m-0 project_card_desc">{cardInfo.info.description}</p>
      <p className="m-0 fw-semibold">Tech stack: {cardInfo.info.stack}</p>
      <a
        target="_blank"
        rel="noreferrer"
        href={cardInfo.info.url}
        style={button_style}
        className="btn project_card_button mt-4 px-5"
      >
        View
      </a>
    </div>
  );
};

export default ProjectCard;
