import { useState } from "react";
import { GetSubjects } from "../../hooks/GetSubjects";
import "./subjectSelector.css";

/**
 * @depreacted
 */
export default function SubjectSelector(props) {
  let subjects = GetSubjects();
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
                  key={subject.id}
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
