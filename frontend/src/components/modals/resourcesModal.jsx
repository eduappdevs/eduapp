import React, { useState } from "react";
import API from "../../API";
import "./modal.css";
let finalData = new FormData();

export default function ResourcesModal() {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [currentlyUser, setCurrentlyUser] = useState("");
  const FILE_LIMIT = 3;

  const handleFileSelect = (e) => {
    e.preventDefault();
    if (e.target.files.length > FILE_LIMIT) {
      alert(`Only ${FILE_LIMIT}  files accepted.`);
      return;
    } else {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const getCurrentlyUser = async () => {
    await API.fetchInfo(localStorage.userId).then((res) => {
      setCurrentlyUser(res.user_name);
    });
  };

  getCurrentlyUser();
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e);
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
    } else {
      console.log("no files to upload");
    }

    if (filesToUpload != null) {
      secondfile = filesToUpload[1];
    } else {
      console.log("no files to upload");
    }

    if (filesToUpload != null) {
      thirdfile = filesToUpload[2];
    } else {
      console.log("no files to upload");
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

    console.log("ccc", currentlyUser);
    finalData.append("createdBy", currentlyUser);
    finalData.append("course_id", e.target[2].value);

    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";

    await API.postResource(finalData);
    window.location.reload();
  };

  const closeModal = () => {
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";
  };

  return (
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
        <input
          type="text"
          name="course"
          placeholder="Course"
          autoComplete="off"
          required
        />
        <div className="fileInputs">
          <div className="firstfile">
            <input
              type="file"
              id="firstfile"
              multiple
              onChange={handleFileSelect}
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

        <button type="submit">SUBMIT</button>
      </form>

      <button id="resources__closeResourceModal" onClick={closeModal}>
        CANCEL
      </button>
    </div>
  );
}
