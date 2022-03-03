import React, { useEffect, useState } from "react";
import "../styles/schedulesessionslist.css";
import axios from "axios";
export default function Schedulesessionslist() {
  const [sessions, setSessions] = useState([]);

  const getSessions = async () => {
    console.log("getting sessions");
    let payload = [];
    let request = await axios.get(`http://localhost:3000/eduapp_user_sessions`);
    request.data.map((e) => {
      let id = e.id;
      let name = e.session_name;
      let date = e.session_date;
      let streamingPlatform = e.streaming_platform;
      let resourcesPlatform = e.resources_platform;
      let chat = e.session_chat_id;
      let sorter =
        date.split("-")[0].split(":")[0] + date.split("-")[0].split(":")[1];
      payload.push({
        id,
        name,
        date,
        streamingPlatform,
        resourcesPlatform,
        chat,
        sorter,
      });
      return true;
    });

    setSessions(payload);
  };

  const AddNewSession = (e) => {
    e.preventDefault();

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
    let name = document.getElementById("s_name").value;
    let date = document.getElementById("s_date").value;
    let resources = document.getElementById("s_resources").value;
    let streaming = document.getElementById("s_streaming").value;
    console.log(date);
    let chat = 1;
    let course_id = document.getElementById("s_courseId").value;
    json.push(name, date, resources, streaming, chat, course_id);
    console.log(json);

    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }
    axios
      .post("http://localhost:3000/eduapp_user_sessions", SessionJson)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getSessions();
  }, []);
  return (
    <div className="schedulesesionslist-main-container">
      <table>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Streaming</th>
          <th>Resources</th>
          <th>Links</th>
          <th>Actions</th>
        </tr>
        <tr>
          <th>
            <button onClick={AddNewSession}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-plus-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>
            </button>
          </th>
          <th>
            <input id="s_name" type="text" placeholder="Name" />
          </th>
          <th>
            <input id="s_start_date" type="datetime-local" placeholder="Date" />
          </th>
          <th>
            <input id="s_end_date" type="datetime-local" placeholder="Date" />
          </th>
          <th>
            <input id="s_streaming" type="text" placeholder="Streaming" />
          </th>
          <th>
            <input id="s_resources" type="text" placeholder="Resources" />
          </th>
          <th>
            <input id="s_courseId" type="text" placeholder="Course" />
          </th>
        </tr>

        {sessions.map((s) => {
          return (
            <tr>
              <td>{s.data.id}</td>
              <td>{s.data.name}</td>
              <td>{s.data.date}</td>
              <td>{s.data.streamingPlatform}</td>
              <td>{s.data.resourcesPlatform}</td>
              <td>empty</td>
              <td>empty</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
