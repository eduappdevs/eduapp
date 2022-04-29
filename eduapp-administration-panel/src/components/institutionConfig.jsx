import React, { useEffect, useState } from "react";
import * as API from "../API";
import axios from "axios";
import "../styles/institutionConfig.css";

export default function InstitutionConfig() {
  const [institutions, setInstitutions] = useState(null);

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
        axios.post(API.endpoints.INSTITUTIONS, { name: name }).then((i) => {
          axios
            .post(API.endpoints.COURSES, {
              name: "Noticias",
              institution_id: i.data.id,
            })
            .then((c) => {
              axios
                .post(API.endpoints.SUBJECTS, {
                  name: "Noticias",
                  teacherInCharge: name,
                  description: "Noticias para el instituto " + name,
                  color: "#96ffb2",
                  course_id: parseInt(c.data.id),
                })
                .then(() => {
                  swapIcons(false);
                  fetchInstitutions();
                });
            });
        });
      });
    }
  };

  const deleteInstitution = (id) => {
    API.asynchronizeRequest(async function () {
      await axios.delete(API.endpoints.INSTITUTIONS + "/" + id);
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
                  <div id="submit-loader" className="loader">
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
                    <input type="text" value={x.name} disabled />
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
                        deleteInstitution(x.id);
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
          ) : null}
        </table>
      </div>
    </>
  );
}
