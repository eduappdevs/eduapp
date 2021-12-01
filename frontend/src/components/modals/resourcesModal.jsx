import React, { useState } from "react";
import axios from "axios";
import "./modal.css";
let payload = [];
let modalIterator = 0;
export default function ResourcesModal() {
  const [inputValue, setInputValue] = useState("");
  const fields = ["name", "description"];
  const modalLength = fields.length - 1;
  const updateValuesFunction = () => {
    payload.push(inputValue);
    modalIterator++;
    setInputValue("");
  };
  const handleNext = () => {
    updateValuesFunction();
    console.log(payload);
  };
  const handleBack = () => {
    setInputValue(payload[modalIterator - 1]);
    modalIterator--;
  };
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSubmit = () => {
    updateValuesFunction();
    let finalJson = {};
    for (let i = 0; i <= modalLength; i++) {
      console.log("in for current index: " + i);
      finalJson[fields[i]] = payload[i];
    }
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "none";
    axios
      .post("http://localhost:3000/resources", finalJson)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        document.getElementsByClassName(
          "resources__createResourceModal"
        )[0].style.display = "none";
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
      <label htmlFor={fields[modalIterator]}>{fields[modalIterator]}</label>
      <input
        name={fields[modalIterator]}
        type={"text"}
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
