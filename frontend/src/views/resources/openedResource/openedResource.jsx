import React, { useState } from "react";
import "./openedResource.css";
import axios from "axios";
export default function OpenedResource(props) {
  const [id, setId] = useState(props.data.id);
  const [name, setName] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description);
  const files = [];
  if (props.data.firstfile !== null) {
    files.push(props.data.firstfile.url);
  }
  if (props.data.secondfile !== null) {
    files.push(props.data.secondfile.url);
  }
  if (props.data.thirdfile !== null) {
    files.push(props.data.thirdfile.url);
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
      .getElementById("resource__res" + id + "__opened")
      .classList.add("openedResource__hidden");
  };
  const isImage = (image) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    console.log("isimageclg", image, imageRegex.test(image));
    return imageRegex.test(image);
  };
  return (
    <div
      id={"resource__res" + id + "__opened"}
      className={"openedResource__main-container openedResource__hidden"}
    >
      <div className="resourceOpened__header">
        <div className="resourceOpened__backToResources">
          <div
            className="resourceOpened__backToResources__container"
            onClick={closeResource}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-caret-left-fill"
              viewBox="0 0 16 16"
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </div>
        </div>
        <div className="resourceOpened__name">
          <h1>{name}</h1>
        </div>
        <div className="resourceOpened__buttons">
          <div
            className="resources__editButton"
            onClick={() => {
              editResource(id);
            }}
          >
            {window.matchMedia("(max-width: 1100px)").matches ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                {" "}
                <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
              </svg>
            ) : (
              "Edit this"
            )}
          </div>

          <div
            className="resources__deleteButton"
            onClick={() => {
              deleteResource(id);
            }}
          >
            {window.matchMedia("(max-width: 1100px)").matches ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"></path>
              </svg>
            ) : (
              "Delete this"
            )}
          </div>
        </div>
      </div>
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
                      <div
                        className={"resource__image"}
                        style={{
                          backgroundImage: `url(${file.replace(
                            "localhost:3001",
                            "localhost:3000"
                          )}) `,
                        }}
                      />
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
        <p>7-12-2021</p>
      </div>
    </div>
  );
}
