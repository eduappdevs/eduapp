import React, { useEffect, useState } from "react";
import * as API from "../API";
import axios from "axios";
import * as INSTITUTIONSERVICE from "../Service/institution.service";
import * as COURSESERVICE from "../Service/course.service";
import * as SUBJECTSERVICE from "../Service/subject.service";
import "../styles/institutionConfig.css";

export default function InstitutionConfig() {
  const [institutions, setInstitutions] = useState(null);
  const [editButtonHidden, setEditButtonHidden] = useState(false);
  const [editOptionButtonHidden, setEditOptionButtonHidden] = useState(true);
  const [editValue, setEditValue] = useState(false);
  const [nameValue, setNameValue] = useState();

  const fetchInstitutions = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.INSTITUTIONS).then((i) => {
        setInstitutions(i.data);
      });
    });
  };

  const createInstitution = () => {
    let name = document.getElementById("i_name").value;
    if (name) {
      swapIcons(true);
      API.asynchronizeRequest(async function () {
        INSTITUTIONSERVICE.createInstitution({ name: name }).then((i) => {
          COURSESERVICE.createCourse({
            name: "Noticias",
            institution_id: i.data.id,
          }).then((s) => {
            SUBJECTSERVICE.createSubject({
              name: "Noticias",
              teacherInCharge: name,
              description: "Noticias para el instituto " + name,
              color: "#96ffb2",
              course_id: parseInt(s.data.id),
            }).then(() => {
              setTimeout(() => {
                swapIcons(true);
                fetchInstitutions();
              }, 500);
            });
          });
        });
      });
    }
  };

  const showEditOptionInstitution = () => {
    setEditOptionButtonHidden(false);
    setEditButtonHidden(true);
    document.getElementsByTagName("input")[1].disabled = false;
  };

  const editInstitution = async (id) => {
    document.getElementsByTagName("input")[1].disabled = true;
    let value = document.getElementsByTagName("input")[1].value;
    INSTITUTIONSERVICE.editInstitution({
      id: id,
      name: value,
    })
      .then(() => {
        setEditOptionButtonHidden(true);
        setEditButtonHidden(false);
        fetchInstitutions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeEditInstitutions = () => {
    setEditOptionButtonHidden(true);
    setEditButtonHidden(false);
    document.getElementsByTagName("input")[1].disabled = true;
  };

  const swapIcons = (state) => {
    if (state) {
      document.getElementById("submit-loader").style.display = "block";
    } else {
      document.getElementById("submit-loader").style.display = "none";
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
          {institutions && institutions.length === 0 ? (
            <tr>
              <td>
                <button onClick={createInstitution}>
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
                <input id="i_name" type="text" placeholder="Name" />
              </td>
            </tr>
          ) : institutions ? (
            institutions.map((x) => {
              return (
                <tr className="institution-entries" key={x.id}>
                  <td>
                    <input type="text" value={x.id} disabled />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editValue === true ? nameValue : x.name}
                      onChange={(e) => {
                        setEditValue(true);
                        setNameValue(e.target.value);
                      }}
                      disabled
                    />
                  </td>

                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {editButtonHidden === false ? (
                      <button onClick={showEditOptionInstitution}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                        <div id="submit-loader" class="loader">
                          Loading...
                        </div>
                      </button>
                    ) : null}
                    {editOptionButtonHidden === false ? (
                      <>
                        <td>
                          <button
                            onClick={() => {
                              editInstitution(x.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-check2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                            </svg>
                            <div id="submit-loader" class="loader">
                              Loading...
                            </div>
                          </button>
                        </td>
                        <td>
                          <button onClick={closeEditInstitutions}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-x-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                              />
                            </svg>
                          </button>
                        </td>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })
          ) : null}
        </table>
      </div>
    </>
  );
}
