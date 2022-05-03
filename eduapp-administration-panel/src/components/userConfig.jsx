import React, { useEffect, useState } from "react";
import * as USERSERVICE from "../services/user.service";
import * as ENROLLSERVICE from "../services/enrollConfig.service";
import * as API from "../API";
export default function UserConfig(props) {
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      USERSERVICE.fetchUserInfos().then((us) => {
        setUsers(us.data);
      });
    });
  };

  const createUser = () => {
    let isAdmin = document.getElementById("u_admin").checked;
    let email = document.getElementById("u_email").value;
    let pass = document.getElementById("u_pass").value;

    if (email && pass) {
      swapIcons(true);
      const payload = new FormData();
      payload.append("user[email]", email);
      payload.append("user[password]", pass);

      API.asynchronizeRequest(function () {
        USERSERVICE.createUser(payload).then((res) => {
          const payload = new FormData();
          payload.delete("user[email]");
          payload.delete("user[password]");
          payload.append("user_id", res.data.message.id);
          payload.append("user_name", res.data.message.email.split("@")[0]);
          payload.append("isAdmin", isAdmin);

          USERSERVICE.createInfo(payload).then(() => {
            userEnroll(res.data.message.id);
            fetchUsers();
            document.getElementById("u_admin").checked = false;
            document.getElementById("u_email").value = null;
            document.getElementById("u_pass").value = null;
            swapIcons(false);
          });
        });
      });
    }
  };

  const userEnroll = (uId) => {
    const payload = new FormData();
    payload.append("course_id", 1);
    payload.append("user_id", uId);

    API.asynchronizeRequest(function () {
      ENROLLSERVICE.createTuition(payload).then(() => {
        console.log("User tuition has been completed successfully!");
      });
    });
  };

  const deleteUser = (id) => {
    API.asynchronizeRequest(function () {
      USERSERVICE.deleteUser(id).then(() => {
        fetchUsers();
      });
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

  const filterUsersWithRole = (role, user) => {
    // eslint-disable-next-line default-case
    switch (role) {
      case null:
        if (user.isAdmin || !user.isAdmin) {
          return true;
        }
        break;
      case 0:
        if (user.isAdmin) {
          return false;
        } else {
          return true;
        }

      case 1:
        if (!user.isAdmin) {
          return false;
        } else {
          return true;
        }
      default:
        break;
    }
  };

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);
  useEffect(() => {
    setUserRole(props.userRole);
  }, [props.userRole]);
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{props.language.email}</th>
              <th>{props.language.password}</th>
              <th>{props.language.isAdmin}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button onClick={createUser}>
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
                <input id="u_email" type="email" placeholder={props.language.email}/>
              </td>
              <td>
                <input id="u_pass" type="password" placeholder={props.language.password} />
              </td>
              <td style={{ textAlign: "center" }}>
                <input id="u_admin" type="checkbox" placeholder={props.language.name} />
              </td>
            </tr>
          </tbody>
        </table>
        <table style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>{props.language.userId}</th>
              <th>{props.language.name}</th>
              <th>{props.language.email}</th>
              <th>{props.language.isAdmin}</th>
              <th>{props.language.googleLinked}</th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users
              ? users.map((u) => {
                  if (search.length > 0) {
                    if (
                      (u.user_name.includes(search) ||
                        u.user.email.includes(search)) &
                      filterUsersWithRole(userRole, u)
                    ) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {u.isAdmin ? (
                              <input type="checkbox" disabled checked />
                            ) : (
                              <input type="checkbox" disabled />
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              placeholder="=> Link in App"
                            />
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
                                deleteUser(u.id);
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
                    }
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {u.isAdmin ? (
                            <input type="checkbox" disabled checked />
                          ) : (
                            <input type="checkbox" disabled />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            placeholder="=> Link in App"
                          />
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
                              deleteUser(u.id);
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
                  }

                  if (search.length > 0) {
                    if (
                      (u.user_name.includes(search) ||
                        u.user.email.includes(search)) &
                      filterUsersWithRole(userRole, u)
                    ) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input type="text" disabled value={u.user_id} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {u.isAdmin ? (
                              <input type="checkbox" disabled checked />
                            ) : (
                              <input type="checkbox" disabled />
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              placeholder="=> Link in App"
                            />
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
                                deleteUser(u.id);
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
                    }
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>
                          <input type="text" disabled value={u.user_id} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {u.isAdmin ? (
                            <input type="checkbox" disabled checked />
                          ) : (
                            <input type="checkbox" disabled />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            placeholder="=> Link in App"
                          />
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
                              deleteUser(u.id);
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
                  }

                  if (search.length > 0) {
                    if (
                      (u.user_name.includes(search) ||
                        u.user.email.includes(search)) &
                      filterUsersWithRole(userRole, u)
                    ) {
                      return (
                        <tr key={u.id}>
                          <td>
                            <input type="text" disabled value={u.user_id} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user_name} />
                          </td>
                          <td>
                            <input type="text" disabled value={u.user.email} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {u.isAdmin ? (
                              <input type="checkbox" disabled checked />
                            ) : (
                              <input type="checkbox" disabled />
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              placeholder="=> Link in App"
                            />
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
                                deleteUser(u.id);
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
                    }
                  } else if (filterUsersWithRole(userRole, u)) {
                    return (
                      <tr key={u.id}>
                        <td>
                          <input type="text" disabled value={u.user_id} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user_name} />
                        </td>
                        <td>
                          <input type="text" disabled value={u.user.email} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {u.isAdmin ? (
                            <input type="checkbox" disabled checked />
                          ) : (
                            <input type="checkbox" disabled />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            disabled
                            placeholder="=> Link in App"
                          />
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
                              deleteUser(u.id);
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
                  }
                })
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
