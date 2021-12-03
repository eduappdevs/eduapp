import React, { useState } from "react";
import axios from "axios";
import "./modal.css";
let payload = [];
let finalData = new FormData();
let modalIterator = 0;

export default function ResourcesModal() {
  const [inputValue, setInputValue] = useState();
  let fileUploadLimiter = 3;
  const fields = [
    ["name", "text"],
    ["description", "text"],
    [
      "files",
      [
        ["firstfile", "file"],
        ["secondfile", "file"],
        ["thirdfile", "file"],
      ],
    ],
  ];
  const fieldsLength = fields.length - 1;
  const updateValuesFunction = (itsFile, fileValue) => {
    if (itsFile) {
      payload.push(fileValue);
    } else {
      payload.push(inputValue);
      modalIterator++;
      setInputValue("");
    }
  };
  const handleNext = () => {
    updateValuesFunction();
  };
  const handleBack = () => {
    setInputValue(payload[modalIterator - 1]);
    modalIterator--;
  };
  const handleChange = (e) => {
    
    if (fields[modalIterator][0] === "files") {
      console.log(e.currentTarget.files[0]);
      updateValuesFunction(true, e.currentTarget.files[0]);
      fileUploadLimiter--
      console.log(fileUploadLimiter)
    } else {
      setInputValue(e.target.value);
    }
  };
  const handleSubmit = () => {
    modalIterator = 0;
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";
    for (let i = 0; i <= fieldsLength; i++) {
      if (fields[i][0] != "files") {
        finalData.append(fields[i][0], payload[i]);
      } else {
        let filesIterator = i;
        for (let j = 0; j < fields[i][1].length; j++) {
          finalData.append(fields[i][1][j][0], payload[filesIterator]);
          console.log(fields[i][1][j][0], payload[filesIterator])
          filesIterator++
         
        }
      }
    }
    axios
      .post("http://localhost:3000/resources", finalData)
      .then((res) => {
        console.log(res);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const closeModal = () => {
    setInputValue("");
    modalIterator = 0;
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";
  };
  return (
    <div className="resources__createResourceModal">
      {window.matchMedia("(max-width : 1100px").matches ? (
        <div className="resources__logoModal">
          <img src="\assets\logo.png" />
        </div>
      ) : (
        ""
      )}
      {fields[modalIterator][1] === "file" ? (
        <label>ADD A FILE {fields[modalIterator][0]}</label>
      ) : (
        <label htmlFor={fields[modalIterator][0]}>
          {fields[modalIterator][0]}
        </label>
      )}
      {fields[modalIterator][0] === "files" ? (
        <>
          <div className="fileInput">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cloud-upload-fill"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"
              />
            </svg>

            {fileUploadLimiter <= 3 && fileUploadLimiter > 1 ? <input
              id={"resource_input"}
              name={fields[modalIterator][1][0][0]}
              type={fields[modalIterator][1][0][1]}
              onChange={handleChange}
              value={inputValue}
              autoComplete="off"
              
            />
            : ''}
            
            {/* <h1>{`You can upload until ${fileUploadLimiter} files`}</h1> */}
          
          </div>
        </>
      ) : (
        <input
          id={"resource_input"}
          name={fields[modalIterator][0]}
          type={fields[modalIterator][1]}
          onChange={handleChange}
          value={inputValue}
          autoComplete="off"
        />
      )}

      <div className="buttons">
        {modalIterator <= fieldsLength && modalIterator > 0 ? (
          <button onClick={handleBack}>Back</button>
        ) : (
          ""
        )}
        {modalIterator < fieldsLength ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Finish</button>
        )}
      </div>

      <button id="resources__closeResourceModal" onClick={closeModal}>
        CANCEL
      </button>
    </div>
  );
}
