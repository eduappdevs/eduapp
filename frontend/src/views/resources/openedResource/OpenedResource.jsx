import React, { useState } from "react";
import axios from "axios";
import AppHeader from "../../../components/appHeader/AppHeader";
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
    axios
      .delete(`http://localhost:3000/resources/${id}`)
      .then((res) => console.log, window.location.reload())
      .catch((err) => console.log);
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

    setTimeout(() => {
      document.getElementsByTagName("header")[0].style.display = "flex";
    }, 100);
  };

  const isImage = (image) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    console.log("isimageclg", image, imageRegex.test(image));
    return imageRegex.test(image);
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
          <ul>
            {files.length > 0 ? (
              files.map((file) => {
                return (
                  <>
                    <li>
                      {file != null &&
                      isImage(
                        file.split("/")[file.split("/").length - 1].split(".")[
                          file.split("/")[file.split("/").length - 1].split(".")
                            .length - 1
                        ]
                      ) ? (
                        <>
                          <h1 it="fileTitle">
                            {file.split("/")[file.split("/").length - 1]}
                          </h1>
                          <div
                            className={"resource__image"}
                            style={{
                              backgroundImage: `url(${file.replace(
                                "localhost:3001",
                                "localhost:3000"
                              )}) `,
                            }}
                          />
                          <a
                            className="fileDownload-button"
                            name="file"
                            href={file}
                          >
                            OPEN
                          </a>
                        </>
                      ) : (
                        <>
                          <>
                            <h1 htmlFor="file">
                              {file != null
                                ? file.split("/")[file.split("/").length - 1]
                                : "file"}
                            </h1>
                            <a
                              className="fileDownload-button"
                              name="file"
                              href={file}
                            >
                              DOWNLOAD
                            </a>
                          </>
                        </>
                      )}
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
        <div className="resourceOpened__date">
          <p>*insert code date*</p>
        </div>
      </div>
    )
  );
}
