import React, { useEffect, useState } from "react";
import AppHeader from "../../../components/appHeader/AppHeader";
import ReactPlayer from "react-player";
import MediaFix from "../../../utils/MediaFixer";
import { asynchronizeRequest } from "../../../API";
import * as RESOURCE_SERVICE from "../../../services/resource.service";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import useRole from "../../../hooks/useRole";
import { getOfflineUser } from "../../../utils/OfflineManager";
import useLanguage from "../../../hooks/useLanguage";
import "./OpenedResource.css";

export default function OpenedResource() {
  const language = useLanguage();
  const [name, setName] = useState("None");
  const [description, setDescription] = useState("None");
  const [subjectOrigin, setSubjectOrigin] = useState("None");
  const [files, setFiles] = useState([]);

  let canAction = useRole(FetchUserInfo(getOfflineUser().user.id), [
    "eduapp-admin",
    "eduapp-teacher",
  ]);

  const deleteResource = (id) => {
    if (canAction) {
      asynchronizeRequest(async function () {
        await RESOURCE_SERVICE.deleteResource(id);
        window.location.reload();
      });
    }
  };

  const editResource = (id) => {
    if (canAction) console.log(id);
  };

  const closeResource = () => {
    window.history.back();
  };

  const namefixed = (name) => {
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
            <a
              className="fileDownload-button"
              name="file"
              href={media}
              rel="noopener noreferrer"
              target="_blank"
            >
              {language.open}
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
              {language.download}
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
              {language.download}
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
        closeHandler={() => closeResource()}
        canAction={canAction}
        resourceName={name}
        editResource={() => editResource(getResourceId())}
        deleteResource={() => deleteResource(getResourceId())}
      />
      <div className="resourceOpened__info">
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
      <div className="resourceOpened__files">
        <h1>{language.resources_files}</h1>
        <ul>
          {files && files.length > 0 ? (
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
              <h1>{language.resources_no_files_attached}</h1>
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
