import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as TUITIONSSERVICE from "../services/enrollConfig.service";
import * as USERSSERVICE from "../services/user.service";
import * as COURSESERVICE from "../services/course.service";

export default function EnrollConfig(props) {
  const [tuitions, setTuitions] = useState(null);
  const [users, setUsers] = useState(null);
  const [courses, setCourses] = useState(null);

  const fetchTuitions = () => {
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.fetchTuitions().then((ts) => {
        setTuitions(ts.data);
      });
    });
  };

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USERSSERVICE.fetchUserInfos().then((us) => {
        setUsers(us.data);
      });
    });
  };

  const fetchCourses = () => {
    API.asynchronizeRequest(function () {
      COURSESERVICE.fetchCourses().then((cs) => {
        setCourses(cs.data);
      });
    });
  };

  const fetchAll = () => {
    fetchCourses();
    fetchTuitions();
    fetchUsers();
  };

  const createTuition = () => {
    let user = document.getElementById("user_select").value;
    let course = document.getElementById("course_select").value;

    let valid = true;
    if (user === "-" && course === "-") valid = false;

    if (valid) {
      API.asynchronizeRequest(function () {
        const payload = new FormData();
        payload.append("course_id", parseInt(course));
        payload.append("user_id", parseInt(user));

        TUITIONSSERVICE.createTuition(payload).then(() => {
          fetchAll();
        });
      });
    }
  };

  const deleteTuition = (id) => {
    API.asynchronizeRequest(function () {
      TUITIONSSERVICE.deleteTuition(id).then(() => {
        fetchAll();
      });
    });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{props.language.user}</th>
              <th>{props.language.course}</th>
            </tr>
          </thead>
          <tbody>
            <tr key={"newTuition"}>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button onClick={createTuition}>
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
                    {props.language.loading} ...
                  </div>
                </button>
              </td>
              <td>
                <select defaultValue={"-"} id="user_select">
                  <option value="-">{props.language.chooseUser}</option>
                  {users
                    ? users.map((u) => {
                        return (
                          <option key={u.id} value={u.user_id}>
                            {u.user.email}
                          </option>
                        );
                      })
                    : null}
                </select>
              </td>
              <td>
                <select defaultValue={"-"} id="course_select">
                  <option value="-">{props.language.chooseCourse}</option>
                  {courses
                    ? courses.map((c) => {
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        {tuitions && tuitions.length !== 0 ? (
          <table style={{ marginTop: "50px" }}>
            <thead>
              <tr>
                <th>{props.language.user}</th>
                <th>{props.language.course}</th>
                <th>{props.language.actions}</th>
              </tr>
            </thead>
            <tbody>
              {tuitions
                ? tuitions.map((t) => {
                    return (
                      <tr key={t.id}>
                        <td>
                          <input type="text" disabled value={t.user.email} />
                        </td>
                        <td>
                          <input type="text" disabled value={t.course.name} />
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
                              deleteTuition(t.id);
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
            </tbody>
          </table>
        ) : null}
      </div>
    </>
  );
}
