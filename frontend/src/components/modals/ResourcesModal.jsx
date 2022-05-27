import React, { useEffect, useState } from "react";
import API, { asynchronizeRequest } from "../../API";
import * as RESOURCESERVICE from "../../services/resource.service";
import "./ResourcesModal.css";
import StandardModal from "./standard-modal/StandardModal";
let finalData = new FormData();

export default function ResourcesModal(props) {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [showFilesToUpload, setShowFilesToUpload] = useState(false);

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");
  const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
  const videoRegex = new RegExp("^.*(mp4|mov)$");

  const deletefile = (e) => {
    let newFile = [];
    filesToUpload.map((file) => {
      if (file !== e) {
        newFile.push(file);
      }
      return true;
    });
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    if (e.target.files.length > 10) {
      setPopup(true);
      setPopupText("Only 10 files are allowed");
      setPopupType("info");
      setFilesToUpload();
      setShowFilesToUpload(false);
      return;
    } else {
      let files = Array.from(e.target.files);

      for (let f of files) {
        if (videoRegex.test(f.name)) {
          if (f.size / 1000 / 1000 > 15) {
            setPopup(true);
            setPopupText("Video is larger than 15MB");
            setPopupType("info");
            setFilesToUpload();
            setShowFilesToUpload(false);
            return;
          }
        } else if (imageRegex.test(f.name)) {
          if (f.size / 1000 / 1000 > 2) {
            setPopup(true);
            setPopupText("Image is larger than 2MB");
            setPopupType("info");
            setFilesToUpload();
            setShowFilesToUpload(false);
            return;
          }
        } else {
          if (f.size / 1000 / 1000 > 5) {
            setPopup(true);
            setPopupText("File is larger than 3MB");
            setPopupType("info");
            setFilesToUpload();
            setShowFilesToUpload(false);
            return;
          }
        }
      }
      setShowFilesToUpload(true);
      if (files.length <= 10) {
        setFilesToUpload(files);
      } else {
        setPopup(true);
        setPopupText("There are too many files, only 10 are allowed.");
        setPopupType("info");
        setFilesToUpload();
        setShowFilesToUpload(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("submit-loader").style.display = "block";

    let name = null;
    let description = null;
    if (e.target[1].value != null) {
      name = e.target[1].value;
    }

    if (e.target[2].value != null) {
      description = e.target[2].value;
    }

    finalData.append("name", name);
    finalData.append("description", description);
    if (filesToUpload !== undefined) {
      for (let i = 0; i < filesToUpload.length; i++)
        finalData.append("file_" + i, filesToUpload[i]);
    }
    finalData.append("createdBy", props.userInfo.user_name);
    finalData.append("subject_id", parseInt(props.subject));

    asynchronizeRequest(async function () {
      RESOURCESERVICE.createResources(finalData).then((e) => {
        if (e) {
          document.getElementsByClassName(
            "resources__createResourceModal"
          )[0].style.display = "none";
          document.getElementById("submit-loader").style.display = "none";
          window.location.reload();
        }
      });
    }).then((error) => {
      if (error) {
        setPopup(true);
        setIsConfirmDelete(false);
        setPopupText(
          "The resource could not be published, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const closeModal = () => {
    setFilesToUpload([]);
    document
      .getElementsByClassName("resources__createResourceModal")[0]
      .classList.remove("resourceModalScale1");
    setTimeout(() => {
      document.getElementsByClassName(
        "resourceModal-container"
      )[0].style.display = "none";
    }, 300);
    document.body.classList.remove("overflow-hide");
    document.body.classList.add("overflow-show");
    document.getElementById("resource-list").classList.remove("hide-rest-res");
  };

  useEffect(() => {
    let nua = navigator.userAgent;
    if (nua.indexOf("Macintosh") === -1)
      document.querySelector(".loader").style.transform =
        "translateZ(0) scale(0.9)";
    else
      document.querySelector(".loader").style.transform =
        "translateZ(0) scale(0.5)";
  }, []);

  return (
    <div className="resourceModal-container">
      <div className="resources__createResourceModal">
        <StandardModal
          show={showPopup}
          iconFill={popupIcon}
          type={popupType}
          text={popupText}
          isQuestion={isConfirmDelete}
          onYesAction={() => {}}
          onNoAction={() => {
            setPopup(false);
            document.getElementById(
              "controlPanelContentContainer"
            ).style.overflow = "scroll";
          }}
          onCloseAction={() => {
            setPopup(false);
            document.getElementById(
              "controlPanelContentContainer"
            ).style.overflow = "scroll";
          }}
          hasIconAnimation
          hasTransition
        />
        <div className="resources__logoModal">
          <img src="\assets\logo.png" alt="logo" />
        </div>
        <h1>NEW RESOURCE</h1>
        <form action="submit" onSubmit={handleSubmit}>
          <div className="fileInputs">
            <div className="firstfile">
              <input
                type="file"
                id="firstfile"
                multiple
                onChange={(e) => {
                  handleFileSelect(e);
                }}
              />
              <label htmlFor="firstfile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                >
                  <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                </svg>
              </label>
            </div>
          </div>
          <input
            type="text"
            name="name"
            placeholder={"Name"}
            autoComplete="off"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            autoComplete="off"
            required
          />
          {showFilesToUpload === true ? (
            <div className="resources-modal-show-files">
              {filesToUpload.map((e) => {
                return (
                  <div className="resources-modal-show-file">
                    <button
                      id={e.name}
                      onClick={() => {
                        deletefile(e);
                      }}
                      className="modal-button-delete-file"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                        id="ins-delete-icon"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                      </svg>
                    </button>
                    <p>{e.name}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className="submit-action">
            <button type="submit">SUBMIT</button>
            <div id="submit-loader" className="loader">
              Loading...
            </div>
          </div>
        </form>

        <button id="resources__closeResourceModal" onClick={closeModal}>
          CANCEL
        </button>
      </div>
      <div className="resourcesModal-outside" onClick={closeModal}></div>
    </div>
  );
}
