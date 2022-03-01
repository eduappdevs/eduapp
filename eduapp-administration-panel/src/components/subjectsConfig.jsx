import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../API";

export default function SubjectsConfig() {
  const [subjects, setSubjects] = useState(null);
  const [courses, setCourses] = useState([]);

  const fetchSubjects = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.SUBJECTS).then((sjs) => {
        setSubjects(sjs.data);
      });
    });
  };

  const fetchCourses = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.COURSES).then((cs) => {
        setCourses(cs.data);
      });
    });
  };

  const createSubject = () => {
    let name = document.getElementById("sj_name").value;
    let teacher = document.getElementById("sj_teacher").value;
    let desc = document.getElementById("sj_desc").value;
    let color = document.getElementById("sj_color").value;
    let sel_course = document.getElementById("course_chooser").value;

    let info = [name, teacher, desc, color, sel_course];

    let valid = true;
    for (let i of info) {
      console.log(i);
      if (i.length < 2 && i === "-") {
        valid = false;
        break;
      }
    }

    if (valid) {
      API.asynchronizeRequest(function () {
        axios
          .post(API.endpoints.SUBJECTS, {
            name: name,
            teacherInCharge: teacher,
            description: desc,
            color: color,
            course_id: parseInt(sel_course),
          })
          .then(() => {
            fetchSubjects();
          });
      });
    }
  };

  const deleteSubject = (id) => {
    API.asynchronizeRequest(function () {
      axios.delete(API.endpoints.SUBJECTS + "/" + id).then(() => {
        fetchSubjects();
      });
    });
  };

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Teacher in Charge</th>
            <th>Description</th>
            <th>Color</th>
            <th>Linked Course</th>
            <th>Actions</th>
          </tr>
          {subjects
            ? subjects.map((sj) => {
                return (
                  <tr>
                    <td>
                      <input disabled type="text" value={sj.id} />
                    </td>
                    <td>
                      <input disabled type="text" value={sj.name} />
                    </td>
                    <td>
                      <input disabled type="text" value={sj.teacherInCharge} />
                    </td>
                    <td>
                      <input disabled type="text" value={sj.description} />
                    </td>
                    <td>
                      <input disabled type="color" value={sj.color} />
                    </td>
                    <td>
                      <input disabled type="text" value={sj.course.name} />
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          deleteSubject(sj.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            : null}
          <tr>
            <td
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button onClick={createSubject}>
                <svg
                  xmlns="http://www.w3.org/2000/ svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                  id="ins-add-icon"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                </svg>
                <div id="submit-loader" class="loader">
                  Loading...
                </div>
              </button>
            </td>
            <td>
              <input id="sj_name" type="text" placeholder="Name" />
            </td>
            <td>
              <input id="sj_teacher" type="text" placeholder="Teacher" />
            </td>
            <td>
              <input id="sj_desc" type="text" placeholder="Description" />
            </td>
            <td>
              <input id="sj_color" type="color" placeholder="Description" />
            </td>
            <td>
              <select id="course_chooser">
                <option selected value="-">
                  Choose Course
                </option>
                {courses
                  ? courses.map((c) => {
                      return <option value={c.id}>{c.name}</option>;
                    })
                  : null}
              </select>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
}
