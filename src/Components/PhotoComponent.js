import React, { useState } from "react";
import download from "../vectors/dl2.svg";

const PhotoComponent = (props) => {
  // State that tracks if the user hovers on image
  // Hovered-on images display the author's name, link to
  // their Unsplash page for download, and the author's
  // personal page (if available)
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="photo-component"
      style={{ backgroundImage: `url('${props.image}')` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={hovered ? "author-info" : "hidden"}>
        <div className="author-name">
          <a href={props.profilePage} target="_blank" rel="noopener noreferrer">
            {props.user}
          </a>
        </div>
        <div className="icons">
          <a href={props.download} target="_blank" rel="noopener noreferrer">
            <img
              src={download}
              width="36px"
              style={{ marginRight: "1em" }}
              alt="download"
            />
          </a>
          <a
            href={props.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-pic"
          >
            <img src={props.profileImage} alt="profile" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PhotoComponent;
