import React from "react";
import { GetSubjects } from "../../hooks/GetSubjects";
import { useState } from "react/cjs/react.development";
import "./subjectSelector.css";

export default function SubjectSelector(props) {
  let subjects = GetSubjects(props.data);
  console.log(subjects.id);

  const [subjectSelected, setSubjectSelected] = useState();

  const handleChangeSubject = (e, id) => {
    if (e.target.classList.contains("inactiveSubject")) {
      props.handleChangeSubject(id);
      setSubjectSelected(id);
    }
  };

  return (
    subjects && (
      <>
        <div className="subjectSelector-container">
          <ul>
            {subjects.map((subject) => {
              return (
                <li
                  className={
                    subjectSelected === subject.id
                      ? "activeSubject"
                      : "inactiveSubject"
                  }
                  onClick={(e) => {
                    handleChangeSubject(e, subject.id);
                  }}
                  id={subject.id}
                >
                  {subject.name}
                </li>
              );
            })}
          </ul>
        </div>
      </>
    )
  );
}
