import React, { useEffect, useState } from "react";
import axios from "axios";
import AppHeader from "../../../components/appHeader/AppHeader";
import ReactPlayer from "react-player";
import MediaFix from "../../../utils/MediaFixer";
import { asynchronizeRequest } from "../../../API";
import { RESOURCES } from "../../../config";
import "./OpenedResource.css";

export default function OpenedResource() {
  const [name, setName] = useState("None");
  const [description, setDescription] = useState("None");
  const [subjectOrigin, setSubjectOrigin] = useState("None");
  const [files, setFiles] = useState([]);

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
    window.history.back();
  };

  const namefixed = (name) => {
    // let codes = [
    //   ["%3A", ":"],
    //   ["%C3%A1", "á"],
    //   ["%C3%81", "Á"],
    //   ["","é"],
    //   ["","É"],
    //   ["","í"],
    //   ["","Í"],
    //   ["","ó"],
    //   ["","Ó"],
    //   ["","ú"],
    //   ["","Ú"],

    // ];

    // for (let c of codes) {
    //   name = name.replaceAll(c[0], c[1]);
    // }

    return decodeURI(name);
  };

  const manageMediaType = (media) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    const videoRegex = new RegExp("^.*(mp4|mov)$");
    let name = media.split("/")[media.split("/").length - 1];

    media = process.env.REACT_APP_BACKEND_ENDPOINT.includes("localhost")
      ? media
      : MediaFix(media);

    if (media != null && (imageRegex.test(media) || videoRegex.test(media))) {
      if (imageRegex.test(media)) {
        return (
          <>
            <h1 it="fileTitle">{namefixed(name)}</h1>
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
            <h1 it="fileTitle">{namefixed(name)}</h1>
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
            <h1 htmlFor="file">{media != null ? namefixed(name) : "file"}</h1>
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
        response = await axios.get(RESOURCES + "/" + getResourceId());
      } catch (err) {
        window.location.href = "/resources";
      }

      setName(response.data.name);
      setDescription(response.data.description);
      setFiles(response.data.resource_files);
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
