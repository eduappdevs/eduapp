import React, { useEffect, useState } from "react";
import AppHeader from "../../../components/appHeader/AppHeader";
import ReactPlayer from "react-player";
import MediaFix from "../../../utils/MediaFixer";
import { asynchronizeRequest } from "../../../API";
import * as RESOURCE_SERVICE from "../../../services/resource.service";
import "./OpenedResource.css";

export default function OpenedResource() {
  const [name, setName] = useState("None");
  const [description, setDescription] = useState("None");
  const [subjectOrigin, setSubjectOrigin] = useState("None");
  const [files, setFiles] = useState([]);

  const deleteResource = (id) => {
    asynchronizeRequest(async function () {
      await RESOURCE_SERVICE.deleteResource(id);
      window.location.reload();
    });
  };

  const editResource = (id) => {
    console.log(id);
  };

  const closeResource = () => {
    window.history.back();
  };

  const manageMediaType = (media) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    const videoRegex = new RegExp("^.*(mp4|mov)$");

    media = process.env.REACT_APP_BACKEND_ENDPOINT.includes("localhost")
      ? media
      : MediaFix(media);

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

  const getResourceId = () => {
    return window.location.href.split("/")[
      window.location.href.split("/").length - 1
    ];
  };

  useEffect(() => {
    asynchronizeRequest(async function () {
      let response = "";
      try {
        response = await RESOURCE_SERVICE.findById(getResourceId());
      } catch (err) {
        window.location.href = "/resources";
      }

      setName(response.data.name);
      setDescription(response.data.description);

      let tempfiles = [];
      if (response.data.firstfile !== null) {
        tempfiles.push(response.data.firstfile.url);
      }

      if (response.data.secondfile !== null) {
        tempfiles.push(response.data.secondfile.url);
      }

      if (response.data.thirdfile !== null) {
        tempfiles.push(response.data.thirdfile.url);
      }

      setFiles(tempfiles);
      setSubjectOrigin(response.data.subject_id);

      window.dispatchEvent(new Event("canLoadResource"));
    });
  }, []);

  return (
    <div
      id={"resource__res" + name + subjectOrigin + "__opened"}
      className={"openedResource__main-container"}
    >
      <AppHeader
        type={"resource"}
        closeHandler={() => {
          closeResource();
        }}
        resourceName={name}
        editResource={() => {
          editResource(getResourceId());
        }}
        deleteResource={() => {
          deleteResource(getResourceId());
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
  );
}
