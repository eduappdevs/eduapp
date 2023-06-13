import React, { useEffect, useState } from "react";
import * as API from "../API";
import * as USERSERVICE from "../services/user.service";
import * as ENROLLSERVICE from "../services/enrollConfig.service";
import { interceptExpiredToken } from "../utils/OfflineManager";

export default function PreviewUsersTable(props) {
  const [users, setUsers] = useState(null);

  const confirmAndUpload = () => {
    users.map((user) => {
      return createUser(user);
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);

    console.log("aqui se sube todo");
  };

  const createUser = (user) => {
    let email = user[0];
    let pass = user[1];
    let isAdmin = user[2];

    if (email && pass) {
      const payload = new FormData();
      payload.append("user[email]", email);
      payload.append("user[password]", pass);

      API.asynchronizeRequest(function () {
        USERSERVICE.createUser(payload)
          .then((res) => {
            const payload = new FormData();
            USERSERVICE.createInfo(payload);
            payload.delete("user[email]");
            payload.delete("user[password]");
            payload.append("user_id", res.data.message.id);
            payload.append("user_name", res.data.message.email.split("@")[0]);
            payload.append("isAdmin", isAdmin);

            USERSERVICE.createInfo(payload)
              .then(() => {
                userEnroll(res.data.message.id);
              })
              .catch(async (err) => {
                await interceptExpiredToken(err);
                console.error(err);
              });
          })
          .catch(async (err) => {
            await interceptExpiredToken(err);
            console.error(err);
          });
      });
    }
  };
  const userEnroll = (uId) => {
    const payload = new FormData();
    payload.append("course_id", 1);
    payload.append("user_id", uId);
    API.asynchronizeRequest(function () {
      ENROLLSERVICE.createTuition(payload)
        .then(() => {
          console.log("User tuition has been completed successfully!");
        })
        .catch(async (err) => {
          await interceptExpiredToken(err);
          console.error(err);
        });
    });
  };

  useEffect(() => {
    setUsers(props.users);
  }, []);

  return (
    users &&
    (props.show ? (
      <div className="users_modal">
        <div className="users_modal_content">
          <div className="users_modal_header">
            <h4 className="users_modal_title">Loading users</h4>
          </div>
          <div className="users_modal_body">
            {users.map((user) => {
              console.log(user);
              return (
                <ul>
                  <li>{"User : " + user[0] + " Password : " + user[1]}</li>
                </ul>
              );
            })}
          </div>

          <div className="users_modal_footer">
            <button className="close_button" onClick={props.close}>
              Cancel
            </button>
            <button className="close" onClick={confirmAndUpload}>
              Confirm and register them
            </button>
          </div>
        </div>
      </div>
    ) : null)
  );
}
