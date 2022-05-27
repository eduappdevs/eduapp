import React, { useEffect, useState } from "react";
import asynchronizeRequest from "../../../API";
import * as RESOURCESERVICE from "../../../services/resource.service";
import StandardModal from "../standard-modal/StandardModal";
import "./ResourcesModal.css";

export default function ResourcesModal({
  show,
  edit,
  language,
  onCloseModal,
  onAddModal,
  name,
  description,
  author,
  subject,
  info,
  create,
}) {
  const [filesToUpload, setFilesToUpload] = useState({});
  const [isUpload, setIsUpload] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState({});
  const [filesToUploadJson, setFilesToUploadJson] = useState({});
  const [showFilesToUpload, setShowFilesToUpload] = useState(false);
  const [filesEdit, setFilesEdit] = useState(false);
  const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
  const videoRegex = new RegExp("^.*(mp4|mov)$");

  const [showPopup, setPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupIcon, setPopupIcon] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [popupType, setPopupType] = useState("");

  let finalData = new FormData();

  const deletefile = async (i) => {
    let newFile = [];
    let deleteFile = [];
    let indexOf = [];
    let json = [];
    info.resource_files.map((file) => {
      if (file !== i) {
        newFile.push(file);
        setIsUpload(true);
      } else {
        indexOf.push(info.resource_files.indexOf(file));
      }
      return true;
    });

    indexOf.map((i) => {
      json.push(info.resource_files_json[i]);
      return deleteFile.push(info.resource_files_json[i]);
    });
    setFilesEdit(true);
    setFilesToDelete(deleteFile);
    setFilesToUpload(newFile);
    setFilesToUploadJson(json);
  };

  const deleteNewfile = async (i) => {
    let newFile = [];
    let deleteFile = [];
    let indexOf = [];
    let json = [];
    filesToUpload.map(async (file) => {
      if (file !== i) {
        newFile.push(file);
        setIsUpload(true);
      } else {
        indexOf.push(filesToUpload.indexOf(file));
      }
      return true;
    });
    indexOf.map((i) => {
      json.push(info.resource_files_json[i]);
      return deleteFile.push(info.resource_files_json[i]);
    });
    setFilesEdit(true);
    setFilesToDelete(deleteFile);
    setFilesToUpload(newFile);
    setFilesToUploadJson(json);
  };

  const createResource = async () => {
    finalData.append("name", name);
    finalData.append("description", description);
    if (filesToUpload !== undefined) {
      for (let i = 0; i < filesToUpload.length; i++)
        finalData.append("file_" + i, filesToUpload[i]);
    }
    finalData.append("createdBy", author);
    finalData.append("subject_id", parseInt(subject.split("_")[1]));

    asynchronizeRequest(function () {
      RESOURCESERVICE.createResources(finalData).then(onAddModal("create"));
    }).then((e) => {
      if (e) {
        setPopup(true);
        setIsConfirmDelete(false);
        setPopupText(
          "The resource could not be published, check if you have an internet connection."
        );
        setPopupIcon("error");
      }
    });
  };

  const confirmCreate = () => {
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText("Are you sure you want to create this resources?");
    setIsConfirmDelete(true);
    setPopup(true);
  };

  const confirmEdit = () => {
    setPopupType("warning");
    setPopupIcon(true);
    setPopupText("Are you sure you want to edit this resources?");
    setIsConfirmDelete(true);
    setPopup(true);
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

  const editResource = async (r) => {
    document.getElementById("controlPanelContentContainer").style.overflow =
      "scroll";

    let inputName = document.getElementById("inputName_" + r.id).value;
    let inputDescription = document.getElementById(
      "inputDescription_" + r.id
    ).value;
    let inputSubject = document.getElementById("inputSubjectID_" + r.id).value;
    let editTitle, editDescription, editSubject;

    if (inputName !== "" && inputName !== r.name) {
      editTitle = inputName;
    } else {
      editTitle = r.name;
    }

    if (inputDescription !== "" && inputDescription !== r.description) {
      editDescription = inputDescription;
    } else {
      editDescription = r.description;
    }

    if (
      inputSubject.split("_")[1] !== "" &&
      inputSubject.split("_")[1] !== r.subject_id
    ) {
      editSubject = inputSubject.split("_")[1];
    } else {
      editSubject = r.subject_id;
    }

    let url = [];
    let blob_id_delete = [];
    let urlJson = [];
    if (isUpload === true) {
      if (filesToUpload !== undefined) {
        filesToUpload.map((f) => {
          return url.push(f);
        });
      }
      if (filesToUploadJson !== undefined) {
        filesToUploadJson.map((f) => {
          return urlJson.push(f);
        });
      }
      if (filesToDelete !== undefined) {
        filesToDelete.map((del) => {
          return blob_id_delete.push(
            parseInt(del.split('blob_id":')[1].split(",")[0])
          );
        });
      }
      asynchronizeRequest(function () {
        RESOURCESERVICE.editResources({
          id: r.id,
          subject_id: parseInt(editSubject),
          name: editTitle,
          description: editDescription,
          resource_files: url,
          resource_files_json: urlJson,
          blob_id_delete: blob_id_delete,
          createdBy: author,
        })
          .then((e) => {
            if (e) {
              setFilesEdit();
              setIsConfirmDelete(false);
              setFilesToUpload();
              onAddModal("edit");
            }
          })
          .catch((e) => {
            if (e) {
              setPopupText(
                "The resources could not be edited, check if you entered the correct fields."
              );
              setIsConfirmDelete(false);
              setPopupIcon("error");
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The resource could not be published, check if you have an internet connection."
          );
          setIsConfirmDelete(false);
          setPopupIcon("error");
        }
      });
    } else {
      asynchronizeRequest(function () {
        RESOURCESERVICE.editResources({
          id: r.id,
          subject_id: parseInt(editSubject),
          name: editTitle,
          description: editDescription,
          resource_files: info.resource_files,
          resource_files_json: info.resource_files_json,
          blob_id_delete: blob_id_delete,
          createdBy: author,
        })
          .then((e) => {
            if (e) {
              setFilesEdit();
              setIsConfirmDelete(false);
              setFilesToUpload();
              onAddModal("edit");
            }
          })
          .catch((e) => {
            if (e) {
              setPopupText(
                "The resources could not be edited, check if you entered the correct fields."
              );
              setIsConfirmDelete(false);
              setPopupIcon("error");
              setPopup(true);
              setIsConfirmDelete(false);
            }
          });
      }).then((e) => {
        if (e) {
          setPopup(true);
          setPopupText(
            "The resource could not be published, check if you have an internet connection."
          );
          setIsConfirmDelete(false);
          setPopupIcon("error");
        }
      });
    }
  };

  useEffect(() => {
    setFilesToUpload();
    setShowFilesToUpload(false);
  }, [show]);

  return (
    <>
      <div
        className="resources-modal-container-main"
        style={{ display: show ? "flex" : "none" }}
      >
        {show && create && (
          <>
            <div className="resources-modal-contents">
              <div className="recources-modal-header">
                <button className="modal-button-close" onClick={onCloseModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-x-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="resources-modal-title">
                <h3>{language.titleAddResources}</h3>
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleFileSelect(e);
                  }}
                />
                <label
                  id="fileUploadButton"
                  htmlFor="fileUpload"
                  className="upload-files-modal-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="17"
                    fill="currentColor"
                    className="bi bi-folder-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
                    <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </label>
              </div>

              <div className="resources-modal-show-files">
                <div className="resources-information">
                  <p>
                    {language.name}:{name}
                  </p>
                  <p>
                    {language.description}:{description}
                  </p>
                  <p>
                    {language.author}:{author}
                  </p>
                  <p>
                    {language.subjects}:{subject.split("_")[0]}
                  </p>
                </div>
                {showFilesToUpload === true
                  ? filesToUpload.map((e) => {
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
                    })
                  : null}

                <div className="modal-button-files">
                  <button
                    className="modal-button-cancel-file"
                    onClick={onCloseModal}
                  >
                    {language.cancel}
                  </button>
                  <button
                    className="modal-button-add-file"
                    onClick={() => {
                      confirmCreate();
                    }}
                  >
                    {language.add}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {edit && (
          <>
            <div className="resources-modal-contents">
              <div className="recources-modal-header">
                <button className="modal-button-close" onClick={onCloseModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-x-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="resources-modal-title">
                <h3>{language.titleEditResources}</h3>
              </div>
              <div className="resources-modal-show-files">
                <div className="resources-information">
                  <p>
                    {language.name}:{name}
                  </p>
                  <p>
                    {language.description}:{description}
                  </p>
                  <p>
                    {language.author}:{author}
                  </p>
                  <p>
                    {language.subjects}:{subject.split("_")[0]}
                  </p>
                  {filesEdit !== true && info.resource_files !== null
                    ? info.resource_files.map((f) => {
                        if (f !== null) {
                          return (
                            <div className="resources-modal-show-file">
                              <button
                                onClick={() => {
                                  deletefile(f);
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
                              <p>{f.split("/")[8]}</p>
                            </div>
                          );
                        }
                        return true;
                      })
                    : filesToUpload !== null && filesToUpload !== undefined
                    ? filesToUpload.map((f) => {
                        if (f[0] !== null) {
                          return (
                            <div className="resources-modal-show-file">
                              <button
                                onClick={() => {
                                  deleteNewfile(f);
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
                              <p>{f.split("/")[8]}</p>
                            </div>
                          );
                        }
                        return true;
                      })
                    : null}
                </div>

                <div className="modal-button-files">
                  <button
                    className="modal-button-cancel-file"
                    onClick={(e) => {
                      onCloseModal(e, info);
                    }}
                  >
                    {language.cancel}
                  </button>
                  <button
                    className="modal-button-add-file"
                    onClick={() => {
                      confirmEdit();
                    }}
                  >
                    {language.edit}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <StandardModal
        show={showPopup}
        iconFill={popupIcon}
        type={popupType}
        text={popupText}
        isQuestion={isConfirmDelete}
        onYesAction={() => {
          if (create) {
            setPopup(false);
            createResource();
          }
          if (edit) {
            setPopup(false);
            editResource(info);
          }
        }}
        onNoAction={() => {
          setPopup(false);
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        onCloseAction={() => {
          setPopup(false);
          setFilesEdit();
          document.getElementById(
            "controlPanelContentContainer"
          ).style.overflow = "scroll";
        }}
        hasIconAnimation
        hasTransition
      />
    </>
  );
}
