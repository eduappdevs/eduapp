import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SCHEDULESERVICE from "../services/schedule.service";
import * as API from "../API";
import { interceptExpiredToken } from "../utils/OfflineManager";

export default function BatchPreviewTable(props) {
  const [data, setData] = useState(null);

  const confirmAndUpload = () => {
    data.map((x) => {
      switch (props.type) {
        case "users":
          createUser(x);
          break;
        case "sessions":
          postSession(x);
          break;
        case "events":
          postEvent(x);
          console.log("click event");
          break;
        default:
          break;
      }
      return setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const postSession = (session) => {
    const context = [
      "session_name",
      "session_start_date",
      "session_end_date",
      "streaming_platform",
      "resources_platform",
      "session_chat_id",
      "subject_id",
    ];

    let json = [];
    let name = session[0];
    let start_date = session[1];
    let end_date = session[2];
    let streaming = session[3];
    let resources = session[4];
    let chat = session[5];
    let subject_id = session[6];

    if (
      name !== "" &&
      start_date !== "" &&
      end_date !== "" &&
      resources !== "" &&
      streaming !== "" &&
      chat !== "" &&
      subject_id !== ""
    ) {
      json.push(
        name,
        start_date,
        end_date,
        streaming,
        resources,
        chat,
        subject_id
      );
    } else {
      console.log("error");
    }

    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }
    API.asynchronizeRequest(function () {
      SCHEDULESERVICE.createSession(SessionJson).catch(async (err) => {
        await interceptExpiredToken(err);
        console.error(err);
      });
    });
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
        API.default
          .createUser(payload)
          .then((res) => {
            const payload = new FormData();
            API.default.createInfo(payload);
            payload.delete("user[email]");
            payload.delete("user[password]");
            payload.append("user_id", res.data.message.id);
            payload.append("user_name", res.data.message.email.split("@")[0]);
            payload.append("isAdmin", isAdmin);

            API.default
              .createInfo(payload)
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
    payload.append("isTeacher", false);

    API.default.enrollUser(payload).then(() => {
      console.log("User tuition has been completed successfully!");
    });
  };

  const postEvent = (event) => {
    const context = [
      "annotation_title",
      "annotation_description",
      "annotation_start_date",
      "annotation_end_date",
      "isGlobal",
      "user_id",
      "subject_id",
    ];

    let payload = [];
    let start_date = event[2];
    let end_date = event[3];
    let name = event[0];
    let description = event[1];
    let isGlobal = event[4];
    let user_id = 1;
    let subject_id = event[5];
    if (
      (name !== "" &&
        description !== "" &&
        start_date !== "" &&
        end_date !== "" &&
        isGlobal !== "" &&
        subject_id !== "",
      user_id !== "")
    ) {
      payload.push(
        start_date,
        end_date,
        name,
        description,
        isGlobal,
        user_id,
        subject_id
      );
    } else {
      console.log("error");
    }

    let eventJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      eventJson[context[i]] = payload[i];
    }
    axios
      .post(SCHEDULESERVICE.EVENTS, eventJson)
      .then(() => {
        window.location.reload();
      })
      .catch(async (err) => {
        await interceptExpiredToken(err);
        console.error(err);
      });
  };

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setData(props.data);
  }, []);

  return (
    props.show && (
      <div className="batch_modal">
        <div className="batch_modal_content">
          <div className="batch_modal_header">
            <h4 className="batch_modal_title">Loading the information.</h4>
          </div>
          <div className="batch_modal_body">
            {data.map((x) => {
              return (
                <ul>
                  <li>
                    {" "}
                    {x.map((i) => {
                      return <span>{" " + i + " "}</span>;
                    })}{" "}
                  </li>
                </ul>
              );
            })}{" "}
          </div>

          <div className="batch_modal_footer">
            <button className="close_button" onClick={props.close}>
              Cancel
            </button>
            <button className="close" onClick={confirmAndUpload}>
              Confirm and finish.
            </button>
          </div>
        </div>
      </div>
    )
  );
}
