import React, { useEffect, useState } from "react";
import { asynchronizeRequest } from "../API";
import { interceptExpiredToken } from "../utils/OfflineManager";
import * as SUBJECT_SERVICE from "../services/subject.service";
import * as USER_SERVICE from "../services/user.service";

export default function TeacherConfig(props) {
  const [users, setUsers] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [teachers, setTeachers] = useState(null);

  const fetchUsers = async () => {
    return await asynchronizeRequest(async function () {
      let users = await USER_SERVICE.fetchUserInfos();
      await interceptExpiredToken(users);
      return users.data;
    });
  };

  const fetchSubjects = async () => {
    return await asynchronizeRequest(async function () {
      let subjects = await SUBJECT_SERVICE.fetchSubjects();
      await interceptExpiredToken(users);
      return subjects.data;
    });
  };

  const formatTeachers = (users, subjects) => {
    let allTeachers = [];
    let allSubjectIds = function () {
      let ids = [];
      for (let i = 0; i < subjects.length; i++) {
        ids.push(subjects[i].id);
      }
      return ids;
    };

    for (let u of users) {
      for (let subject_id of u.teaching_list) {
        if (allSubjectIds().includes(subject_id)) {
          allTeachers.push({
            user: u,
            subject: subjects.find((s) => s.id === subject_id),
          });
        }
      }
    }
    setTeachers(allTeachers);
  };

  const createTeacher = async () => {
    const user = document.getElementById("user_select").value;
    const subject = document.getElementById("subject_select").value;

    asynchronizeRequest(async () => {
      let enroll = await USER_SERVICE.enroll_teacher(user, subject);
      await interceptExpiredToken(enroll);
      refreshTeachers();
    }).then((err) => {
      if (err) console.log("There was an error creating.");
    });
  };

  const refreshTeachers = () => {
    fetchUsers()
      .then((users) => {
        fetchSubjects()
          .then((subjects) => {
            formatTeachers(users, subjects);
            setUsers(users);
            setSubjects(subjects);
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
  };

  const deleteTeacher = async (uId, sId) => {
    asynchronizeRequest(async () => {
      let delist = await USER_SERVICE.delist_teacher(uId, sId);
      await interceptExpiredToken(delist);
      refreshTeachers();
    }).then((err) => {
      if (err) console.log("There was an error deleting.");
    });
  };

  useEffect(() => {
    refreshTeachers();
  }, []);

  return (
    <div className="schedulesesionslist-main-container">
      <table>
        <thead>
          <tr>
            <th>{props.language.add}</th>
            <th>{props.language.user}</th>
            <th>{props.language.subjectToTeach}</th>
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
              <button onClick={createTeacher}>
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
                          {u.user_name}
                        </option>
                      );
                    })
                  : null}
              </select>
            </td>
            <td>
              <select defaultValue={"-"} id="subject_select">
                <option value="-">{props.language.chooseSubject}</option>
                {subjects
                  ? subjects.map((s) => {
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      );
                    })
                  : null}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      {teachers && teachers.length !== 0 ? (
        <table style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>{props.language.teacherName}</th>
              <th>{props.language.subjectName}</th>
              <th>{props.language.actions}</th>
            </tr>
          </thead>
          <tbody>
            {teachers
              ? teachers.map((t) => {
                  return (
                    <tr key={t.id}>
                      <td>
                        <input type="text" disabled value={t.user.user_name} />
                      </td>
                      <td>
                        <input type="text" disabled value={t.subject.name} />
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
                            deleteTeacher(t.user.id, t.subject.id);
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
  );
}
