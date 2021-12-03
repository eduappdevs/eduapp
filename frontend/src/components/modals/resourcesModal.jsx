import React, { useState } from "react";
import axios from "axios";
import "./modal.css";
let payload = [];
let finalData = new FormData();
let modalIterator = 0;
export default function ResourcesModal() {
  const [inputValue, setInputValue] = useState();
  const fields = [
    ["name", "text"],
    ["description", "text"],
    ["files", "file"],
  ];
  const modalLength = fields.length - 1;
  const updateValuesFunction = (itsFile, fileValue) => {
    if (itsFile) {
      payload.push(fileValue);
      modalIterator++;
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
    if (fields[modalIterator][1] === "file") {
      updateValuesFunction(true, e.currentTarget.files[0]);
    } else {
      setInputValue(e.target.value);
    }
  };
  const handleSubmit = () => {
    modalIterator = 0;
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";
    for (let i = 0; i <= modalLength; i++) {
      finalData.append(fields[i][0], payload[i]);
    }
    axios
      .post("http://localhost:3000/resources", finalData)
      .then((res) => {
        console.log(res);
        window.location.reload();
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
      <label htmlFor={fields[modalIterator][0]}>
        {fields[modalIterator][0]}
      </label>
      <input
        id={"resource_input"}
        name={fields[modalIterator][0]}
        type={fields[modalIterator][1]}
        onChange={handleChange}
        value={inputValue}
        autoComplete="off"
      />
      <div className="buttons">
        {modalIterator <= modalLength && modalIterator > 0 ? (
          <button onClick={handleBack}>Back</button>
        ) : (
          ""
        )}
        {modalIterator < modalLength ? (
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
