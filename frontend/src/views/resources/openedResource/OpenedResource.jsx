import React, { useState } from "react";
import axios from "axios";
import AppHeader from "../../../components/appHeader/AppHeader";
import ReactPlayer from "react-player";
import MediaFix from "../../../utils/MediaFixer";
import { asynchronizeRequest } from "../../../API";
import { RESOURCES } from "../../../config";
import "./OpenedResource.css";

export default function OpenedResource(props) {
  const [id, setId] = useState(props.data.id);
  const [name, setName] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description);
  const files = [];

  if (props.data.firstfile !== null) {
    files.push(props.data.firstfile);
  }

  if (props.data.secondfile !== null) {
    files.push(props.data.secondfile);
  }

  if (props.data.thirdfile !== null) {
    files.push(props.data.thirdfile);
  }

  const deleteResource = (id) => {
    asynchronizeRequest(function () {
      axios
        .delete(RESOURCES + `/${id}`)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => console.log);
    });
  };

  const editResource = (id) => {
    console.log(id);
  };

  const closeResource = () => {
    document
      .getElementById(
        "resource__res" + props.data.name + props.courseSelected + "__opened"
      )
      .classList.add("openedResource__hidden");
    document.getElementById("resource-list").classList.remove("hide-rest-res");

    setTimeout(() => {
      document.getElementsByTagName("header")[0].style.display = "flex";

      document.getElementsByClassName(
        "mobileSection"
      )[0].childNodes[0].style.zIndex = 999;
      document.getElementsByClassName(
        "mobileSection"
      )[0].childNodes[1].style.zIndex = 999;
      document.getElementsByClassName(
        "mobileSection"
      )[0].childNodes[2].style.zIndex = -999;
    }, 100);
  };

  const manageMediaType = (media) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    const videoRegex = new RegExp("^.*(mp4|mov)$");

    media = MediaFix(media);

    if (media != null && (imageRegex.test(media) || videoRegex.test(media))) {
      if (imageRegex.test(media)) {
        return (
          <>
            <h1 it="fileTitle">
              {media.split("/")[media.split("/").length - 1]}
            </h1>
            <div
              className={"resource__image"}
              style={{
                backgroundImage: `url(${media}) `,
              }}
            />
            <a className="fileDownload-button" name="file" href={media}>
              OPEN
            </a>
          </>
        );
      } else {
        return (
          <>
            <h1 it="fileTitle">
              {media.split("/")[media.split("/").length - 1]}
            </h1>
            <ReactPlayer
              url={media}
              controls={true}
              width={window.innerWidth - 100}
              height={250}
            />
            <a className="fileDownload-button" name="file" href={media}>
              DOWNLOAD
            </a>
          </>
        );
      }
    } else {
      return (
        <>
          <>
            <h1 htmlFor="file">
              {media != null
                ? media.split("/")[media.split("/").length - 1]
                : "file"}
            </h1>
            <a className="fileDownload-button" name="file" href={media}>
              DOWNLOAD
            </a>
          </>
        </>
      );
    }
  };

  return (
    files && (
      <div
        id={
          "resource__res" + props.data.name + props.courseSelected + "__opened"
        }
        className={"openedResource__main-container openedResource__hidden"}
      >
        <AppHeader
          type={"resource"}
          closeHandler={() => {
            closeResource();
          }}
          resourceName={name}
          editResource={() => {
            editResource(id);
          }}
          deleteResource={() => {
            deleteResource(id);
          }}
        />
        <div className="resourceOpened__info">
          <h1>{name}</h1>
          <p>{description}</p>
        </div>
        <div className="resourceOpened__files">
          <h1>Files</h1>
          <p id="wip">EduApp W.I.P</p>
          <ul>
            {files.length > 0 ? (
              files.map((file) => {
                return (
                  <>
                    <li className={file != null ? "file-media" : ""}>
                      {manageMediaType(file)}
                    </li>
                  </>
                );
              })
            ) : (
              <div className="resources__NO_FILES">
                <h1>No files attached.</h1>
              </div>
            )}
          </ul>
        </div>
        {/* <div className="resourceOpened__date">
          <p>*insert code date*</p>
        </div> */}
      </div>
    )
  );
}
