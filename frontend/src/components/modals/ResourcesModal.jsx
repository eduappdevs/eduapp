import React, { useEffect, useState } from "react";
import API, { asynchronizeRequest } from "../../API";
import "./ResourcesModal.css";
let finalData = new FormData();

export default function ResourcesModal(props) {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [currentlyUser, setCurrentlyUser] = useState("");
  const [displayFileWarning, setWarnDisplay] = useState("none");
  const [fileWarningText, setWarningText] = useState(
    "Only 3 files are allowed"
  );

  const FILE_LIMIT = 3;
  const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
  const videoRegex = new RegExp("^.*(mp4|mov)$");

  const displayWarning = (text) => {
    setWarningText(text);
    setWarnDisplay("block");
    setTimeout(() => {
      setWarnDisplay("none");
    }, 2000);
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    if (e.target.files.length > FILE_LIMIT) {
      displayWarning("Only 3 files are allowed");
      return;
    } else {
      let files = Array.from(e.target.files);

      for (let f of files) {
        console.log("hi", f);
        if (videoRegex.test(f.name)) {
          if (f.size / 1000 / 1000 > 15) {
            displayWarning("Video is larger than 15MB");
            document.getElementById("submit-loader").style.display = "none";
            return;
          }
        } else if (imageRegex.test(f.name)) {
          if (f.size / 1000 / 1000 > 2) {
            displayWarning("Image is larger than 2MB");
            document.getElementById("submit-loader").style.display = "none";
            return;
          }
        } else {
          if (f.size / 1000 / 1000 > 5) {
            displayWarning("File is larger than 3MB");
            document.getElementById("submit-loader").style.display = "none";
            return;
          }
        }
      }
      setFilesToUpload(files);
    }
  };

  const getCurrentlyUser = async () => {
    asynchronizeRequest(async () => {
      await API.fetchInfo(localStorage.userId).then((res) => {
        setCurrentlyUser(res.user_name);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("submit-loader").style.display = "block";

    let name = null;
    let description = null;
    let firstfile = null;
    let secondfile = null;
    let thirdfile = null;

    if (e.target[0].value != null) {
      name = e.target[0].value;
    }

    if (e.target[1].value != null) {
      description = e.target[1].value;
    }

    if (filesToUpload != null) {
      firstfile = filesToUpload[0];
    }

    if (filesToUpload != null) {
      secondfile = filesToUpload[1];
    }

    if (filesToUpload != null) {
      thirdfile = filesToUpload[2];
    }

    finalData.append("name", name);
    finalData.append("description", description);
    if (firstfile !== null && firstfile !== undefined) {
      finalData.append("firstfile", firstfile);
    }

    if (secondfile !== null && secondfile !== undefined) {
      finalData.append("secondfile", secondfile);
    }

    if (thirdfile !== null && thirdfile !== undefined) {
      finalData.append("thirdfile", thirdfile);
    }
    finalData.append("createdBy", currentlyUser);
    finalData.append("subject_id", props.subject);

    await API.postResource(finalData);
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";
    document.getElementById("submit-loader").style.display = "none";
    window.location.reload();
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
  };

  useEffect(() => {
    getCurrentlyUser();
  }, []);

  return (
    <div className="resourceModal-container">
      <div className="resources__createResourceModal">
        <div className="resources__logoModal">
          <img src="\assets\logo.png" alt="logo" />
        </div>
        <h1>NEW RESOURCE</h1>
        <form action="submit" onSubmit={handleSubmit}>
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
          <div className="file-warning" style={{ display: displayFileWarning }}>
            <p>{fileWarningText}</p>
          </div>
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
