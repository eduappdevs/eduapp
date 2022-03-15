import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../API";
import LoadUsersCSV from "./loadUsersCSV";
export default function UserConfig() {
  const [users, setUsers] = useState(null);

  const fetchUsers = () => {
    API.asynchronizeRequest(function () {
      axios.get(API.endpoints.USERS_INFO).then((us) => {
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
        API.default.createUser(payload).then((res) => {
          const payload = new FormData();
          API.default.createInfo(payload);
          payload.delete("user[email]");
          payload.delete("user[password]");
          payload.append("user_id", res.data.message.id);
          payload.append("user_name", res.data.message.email.split("@")[0]);
          payload.append("isAdmin", isAdmin);

          API.default.createInfo(payload).then(() => {
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
    payload.append("isTeacher", false);

    API.default.enrollUser(payload).then(() => {
      console.log("User tuition has been completed successfully!");
    });
  };

  const deleteUser = (id) => {
    API.asynchronizeRequest(function () {
      axios.delete(API.endpoints.USERS + "/remove/" + id).then(() => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="schedulesesionslist-main-container">

        
        <table>
          <tr>
            <th>Add</th>
            <th>Email</th>
            <th>Password</th>
            <th>Is Admin</th>
          </tr>
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
                <div id="submit-loader" class="loader">
                  Loading...
                </div>
              </button>
            </td>
            <td>
              <input id="u_email" type="email" placeholder="Email" />
            </td>
            <td>
              <input id="u_pass" type="password" placeholder="Password" />
            </td>
            <td style={{ textAlign: "center" }}>
              <input id="u_admin" type="checkbox" placeholder="Name" />
            </td>
          </tr>
        </table>
        {users && users.length !== 0 ? (
          <table style={{ marginTop: "50px" }}>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Has Google Linked</th>
              <th>Actions</th>
            
            </tr>
            <p>You will upload this users, review and confirm</p>
            <div id="tempUsersUploading">
              
              
              </div>



            {users
              ? users.map((u) => {
                  return (
                    <tr>
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
                })
              : null}
          </table>
        ) : null}
      </div>
    </>
  );
}
