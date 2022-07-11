/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { GetSubjects } from "../../hooks/GetSubjects";
import { getOfflineUser } from "../../utils/OfflineManager";
import "./SubjectDropdown.css";

/**
 * A subject dropdown that displays a vertical lists of subjects.
 *
 * @param {Boolean} dropdown Displays the dropdown.
 * @param {Function} closeAction Executes the function when closed.
 * @param {Function} onSubjectClick Executes a function when a subject is clicked.
 * @param {Object} language THe language to use.
 */
export default function SubjectDropdown({
  dropdown,
  closeAction,
  onSubjectClick,
  language,
}) {
  const [showDropdown, setShowDropdown] = useState(true);
  const [hasDoneFirstAppearance, setHasDoneFirstAppearance] = useState(false);
  const subjects = GetSubjects(getOfflineUser().user.id);

  const windDown = () => {
    document.getElementById("subject-dropdown").classList.remove("wind-up");
    document
      .getElementById("subject-dropdown")
      .classList.remove("wind-up-text");
    document.getElementById("subject-dropdown").classList.add("wind-down");
    document.getElementById("subject-dropdown").classList.add("wind-down-text");
    setShowDropdown(true);
  };

  const windUp = () => {
    document
      .getElementById("subject-dropdown")
      .classList.remove("first-appearance");
    document.getElementById("subject-dropdown").classList.remove("wind-down");
    document
      .getElementById("subject-dropdown")
      .classList.remove("wind-down-text");
    document.getElementById("subject-dropdown").classList.add("wind-up");
    document.getElementById("subject-dropdown").classList.add("wind-up-text");
    setTimeout(() => setShowDropdown(false), 700);
  };

  useEffect(() => {
    setTimeout(() => {
      setHasDoneFirstAppearance(true);
    }, 800);
  }, []);

  useEffect(() => {
    if (hasDoneFirstAppearance) {
      if (dropdown) {
        windDown();
      } else {
        windUp();
      }
    }
  }, [dropdown]);

  return (
    <ul
      id="subject-dropdown"
      className={`subject-dropdown first-appearance`}
      style={{ display: showDropdown ? "flex" : "none" }}
    >
      {subjects.length > 1 && (
        <>
          <li className="drpdwn-subtitle">{language.subjects}</li>
          {subjects.map((subject, index) => {
            if (index > 0) {
              return (
                <li
                  id={`subject_${subject.id}_${subject.name}`}
                  onClick={(e) => {
                    onSubjectClick(e.target.id);
                    windUp();
                  }}
                  key={subject.id}
                >
                  {subject.name}
                </li>
              );
            }
            return null;
          })}
        </>
      )}
      <li className="drpdwn-subtitle">{language.other}</li>
      <li
        onClick={(e) => {
          onSubjectClick(e.target.id);
          windUp();
        }}
        id={`subject_${subjects.length > 0 ? subjects[0].id : -1}_${
          subjects.length > 0 ? subjects[0].name : -1
        }`}
      >
        {subjects.length > 0 ? subjects[0].name : ""}
      </li>
      <li className="drpdwn-subtitle drpdwn-close" onClick={closeAction}>
        {language.close}
      </li>
    </ul>
  );
}
