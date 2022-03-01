import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../API";

export default function CourseConfig() {
  const [courses, setCourses] = useState(null);
  const [institutions, setInstitutions] = useState([]);

  const fetchInstitutions = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.INSTITUTIONS).then((i) => {
        setInstitutions(i.data);
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

  const createCourse = () => {
    let cName = document.getElementById("c_name").value;
    let cInst = document.getElementById("institution_chooser").value;

    if (cName.length > 1 && cInst !== "--") {
      swapIcons(true);
      API.asynchronizeRequest(function () {
        axios
          .post(API.endpoints.COURSES, {
            name: cName,
            institution_id: parseInt(cInst),
          })
          .then((x) => {
            if (courses.length === 0) {
              let instTemp = null;
              for (let inst of institutions) {
                if (inst.id === parseInt(cInst)) {
                  instTemp = inst.name;
                }
              }

              axios
                .post(API.endpoints.SUBJECTS, {
                  name: "Noticias",
                  teacherInCharge: instTemp,
                  description: "Noticias para el instituto " + instTemp,
                  color: "#96ffb2",
                  course_id: parseInt(x.data.id),
                })
                .then(() => {
                  fetchCourses();
                  swapIcons(false);
                });
            } else {
              fetchCourses();
              swapIcons(false);
            }
          });
      });
    }
  };

  const deleteCourse = (id) => {
    API.asynchronizeRequest(function () {
      if (courses.length === 1) {
        axios.get(API.endpoints.SUBJECTS + "?name=Noticias").then((x) => {
          axios.delete(API.endpoints.SUBJECTS + "/" + x.data[0].id).then(() => {
            axios.delete(API.endpoints.COURSES + "/" + id).then(() => {
              fetchCourses();
            });
          });
        });
      } else {
        axios.delete(API.endpoints.COURSES + "/" + id).then(() => {
          fetchCourses();
        });
      }
    });
  };

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
      document.getElementById("ins-add-icon").style.display = "none";
    } else {
      document.getElementById("submit-loader").style.display = "none";
      document.getElementById("ins-add-icon").style.display = "block";
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstitutions();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Linked Institution</th>
            <th>Actions</th>
          </tr>
          {courses
            ? courses.map((c) => {
                return (
                  <tr>
                    <td>
                      <input disabled type="text" value={c.id} />
                    </td>
                    <td>
                      <input disabled type="text" value={c.name} />
                    </td>
                    <td>
                      <input disabled type="text" value={c.institution.name} />
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
                          deleteCourse(c.id);
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
              <button onClick={createCourse}>
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
              <input id="c_name" type="text" placeholder="Name" />
            </td>
            <td>
              <select id="institution_chooser">
                <option selected value="--">
                  Choose Institution
                </option>
                {institutions.map((i) => {
                  return <option value={i.id}>{i.name}</option>;
                })}
              </select>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
}
