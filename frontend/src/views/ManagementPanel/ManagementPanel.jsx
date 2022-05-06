import React, { useEffect, useState } from "react";
import * as COURSE_SERVICE from "../../services/course.service";
import * as USER_SERVICE from "../../services/user.service";
import * as INSTITUTION_SERVICE from "../../services/institution.service";
import * as SCHEDULE_SERVICE from "../../services/schedule.service";
import * as ENROLL_SERVICE from "../../services/enrollment.service";
import AppHeader from "../../components/appHeader/AppHeader";
import "./ManagementPanel.css";

var institutions, courses, users;

export default function ManagementPanel() {
  const [isMobile, setIsMobile] = useState(false);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [allowNewInstitution, setAllowInstitution] = useState(true);

  const postSession = async (e) => {
    e.preventDefault();

    const context = [
      "session_name",
      "session_date",
      "streaming_platform",
      "resources_platform",
      "session_chat_id",
      "course_id",
    ];

    let json = [];
    var obj = e.target;
    let name = obj.session_name.value;
    let start = obj.start.value;
    let end = obj.end.value;
    let resources = obj.resources.value;
    let platform = obj.streaming.value;
    let date = start + "-" + end;
    let chat = obj.chat.value;
    let course_id = obj.course_id.value;

    json.push(name, date, resources, platform, chat, course_id);
    let SessionJson = {};
    for (let i = 0; i <= context.length - 1; i++) {
      SessionJson[context[i]] = json[i];
    }
    await SCHEDULE_SERVICE.createSession(SessionJson);
    window.location.reload();
  };

  const fetchInstitutions = () => {
    try {
      INSTITUTION_SERVICE.fetchInstitutions().then((res) => {
        institutions = res.data;
        setInstitutionsLoading(false);
        if (res.data.length > 0) setAllowInstitution(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getInstitution = (id) => {
    let res;
    institutions.map((i) => {
      if (i.id === id) res = i.name;
      return 0;
    });
    return res;
  };

  const fetchUsers = () => {
    try {
      USER_SERVICE.fetchUserInfos().then((res) => {
        users = res.data;
        setUsersLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourses = () => {
    try {
      COURSE_SERVICE.fetchCourses().then((res) => {
        courses = res.data;
        setCoursesLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const postInstitution = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", e.target.institution_name.value);
    // API.createInstitution(payload);
    // window.location.reload();
  };

  const postCourse = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", e.target.name.value);
    payload.append("institution_id", e.target.institution_id.value);

    await COURSE_SERVICE.createCourse(payload);
    window.location.reload();
  };

  const deleteInstitution = (event) => {
    event.preventDefault();
    // API.deleteInstitution(event.target.institutions.value);
    // window.location.reload();
  };

  const deleteCourse = async (id) => {
    await COURSE_SERVICE.deleteCourse(id);
  };

  const createUser = (event) => {
    event.preventDefault();
    let isAdmin = event.target.isAdmin.checked;
    const payload = new FormData();
    payload.append("user[email]", event.target.email.value);
    payload.append("user[password]", event.target.password.value);
    USER_SERVICE.createUser(payload)
      .then((res) => {
        const payload = new FormData();

        payload.delete("user[email]");
        payload.delete("user[password]");
        payload.append("user_id", res.data.message.id);
        payload.append("user_name", res.data.message.email.split("@")[0]);
        payload.append("isAdmin", isAdmin);

        USER_SERVICE.createInfo(payload).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => console.log(err));
  };

  const userEnroll = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append(
      "course_id",
      e.target.tuition_course.value.split(":")[1].split("/")[0]
    );
    payload.append(
      "institution_id",
      e.target.tuition_course.value.split(":")[1].split("/")[1]
    );
    payload.append("user_id", e.target.tuition_user.value);
    payload.append("course_name", e.target.tuition_course.value.split(":")[0]);
    payload.append(
      "institution_name",
      getInstitution(e.target.tuition_course.value.split(":")[1].split("/")[1])
    );
    payload.append("isTeacher", e.target.isTeacher.checked);

    ENROLL_SERVICE.createTuition(payload).then(() => {
      window.location.reload();
    });
  };

  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.innerWidth < 1100) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }, 1000);
  };

  const openThisItem = (input) => {
    let item = document.getElementById(input);
    item.classList.remove("hidden");
    Array.from(document.getElementsByClassName("buttonManagementPanel")).map(
      (button) => {
        button.classList.add("hidden");
        return true;
      }
    );
    document.getElementsByTagName("header")[0].style.display = "none";
  };

  const closeThisItem = (input) => {
    let item = document.getElementById(input);
    item.classList.add("hidden");
    Array.from(document.getElementsByClassName("buttonManagementPanel")).map(
      (button) => {
        button.classList.remove("hidden");
        return true;
      }
    );
    document.getElementsByTagName("header")[0].style.display = "flex";
  };

  useEffect(() => {
    fetchInstitutions();
    fetchCourses();
    fetchUsers();
    checkMediaQueries();

    //First check
    if (window.innerWidth < 1100) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  return !institutionsLoading &&
    institutions !== undefined &&
    !coursesLoading &&
    courses !== undefined &&
    !usersLoading &&
    users !== undefined ? (
    <div className="managementpanel__main">
      <div className="managementpanel__container">
        <div
          id="buttonManagementPanel__intitutions"
          className="buttonManagementPanel"
          onClick={() => {
            openThisItem("institutions");
          }}
        >
          <span>Institution</span>
        </div>
        <div
          className="buttonManagementPanel"
          onClick={() => {
            openThisItem("courses");
          }}
        >
          <span>Courses</span>
        </div>
        <div
          className="buttonManagementPanel"
          onClick={() => {
            openThisItem("users");
          }}
        >
          <span>Users</span>
        </div>
        <div
          className="buttonManagementPanel"
          onClick={() => {
            openThisItem("enrollments");
          }}
        >
          <span>Enrollments</span>
        </div>
        <div
          className="buttonManagementPanel"
          onClick={() => {
            openThisItem("sessions");
          }}
        >
          <span>Sessions</span>
        </div>
        <div
          id="institutions"
          className="managementpanel__institutions managementpanel__item hidden"
        >
          <AppHeader
            closeHandler={() => {
              closeThisItem("institutions");
            }}
            tabName="Institutions"
          />

          <div className="managementpanel__item__header">
            <div id="cp-institutions" className="institutions">
              <div className="institutions__post management__form-container">
                <form action="submit" onSubmit={postInstitution}>
                  <label htmlFor="institution_name">Institution name</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="institution_name"
                    required
                  />
                  <p
                    style={{
                      color: "red",
                      display: allowNewInstitution ? "none" : "block",
                    }}
                  >
                    No more than 1 institution is allowed
                  </p>
                  {allowNewInstitution ? (
                    <button type="submit">SUBMIT</button>
                  ) : (
                    <button type="submit" disabled>
                      SUBMIT
                    </button>
                  )}
                </form>
              </div>
              <div className="institutions__delete management__form-container">
                <h3>DELETE AN INSTITUTION</h3>
                <form action="submit" onSubmit={deleteInstitution}>
                  <select name="institutions" id="institutions_delete">
                    {institutions.map((i) => {
                      return (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                  <button type="submit">DELETE</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          id="courses"
          className="managementpanel__courses managementpanel__item hidden"
        >
          <AppHeader
            closeHandler={() => {
              closeThisItem("courses");
            }}
            tabName="Courses"
          />
          <div className="managementpanel__item__header">
            <div id="cp-courses" className="courses">
              <div className="courses__post management__form-container">
                <form action="submit" onSubmit={postCourse}>
                  <input type="text" name="name" />
                  <select name="institution_id" id="institution_id">
                    {institutions.map((i) => {
                      return (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                  <button type="submit">SUBMIT</button>
                </form>
              </div>
              <div className="courses__delete management__form-container">
                <h3>DELETE A COURSE</h3>
                <form action="submit" onSubmit={deleteCourse}>
                  <select name="courses" id="courses_delete">
                    {courses.map((i) => {
                      return (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                  <button type="submit">DELETE</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          id="users"
          className="managementpanel__users managementpanel__item hidden"
        >
          <AppHeader
            closeHandler={() => {
              closeThisItem("users");
            }}
            tabName="Users"
          />
          <div className="managementpanel__item__header">
            <div id="cp-users" className="users">
              <div className="users__post management__form-container">
                <form action="submit" onSubmit={createUser}>
                  <label htmlFor="email">Email </label>
                  <input autoComplete="off" type="text" name="email" />
                  <label htmlFor="password">Password</label>
                  <input autoComplete="off" type="password" name="password" />
                  <label htmlFor="isAdmin">Admin</label>
                  <input
                    autoComplete="off"
                    type="checkbox"
                    name="isAdmin"
                    id="isAdmin"
                    value="isAdmin"
                  />
                  <button type="submit">SIGN UP</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          id="enrollments"
          className="managementpanel__enrollments managementpanel__item hidden"
        >
          <AppHeader
            closeHandler={() => {
              closeThisItem("enrollments");
            }}
            tabName="Enrollments"
          />
          <div
            className="managementpanel__item__header"
            style={{ marginLeft: "9%" }}
          >
            <div className="user_tuition management__form-container">
              <form action="submit" onSubmit={userEnroll}>
                <label htmlFor="tuition_course">Course</label>
                <select name="tuition_course" id="tuition_course">
                  {courses.map((i) => {
                    return (
                      <option
                        key={i.id}
                        value={i.name + ":" + i.id + "/" + i.institution_id}
                      >
                        {i.name} of {getInstitution(i.institution_id)}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="tuition_user">User</label>

                <select name="tuition_user" id="tuition_user">
                  {users.map((i) => {
                    return (
                      <option key={i.id} value={i.id}>
                        {i.user_name},{i.id}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="isTeacher">Teacher</label>
                <input
                  type="checkbox"
                  name="isTeacher"
                  id="isTeacher"
                  value="isTeacher"
                />
                <button type="submit">ENROLL</button>
              </form>
            </div>
          </div>
        </div>
        <div
          id="sessions"
          className="managementpanel__sessions managementpanel__item hidden"
        >
          <AppHeader
            closeHandler={() => {
              closeThisItem("sessions");
            }}
            tabName="Sessions"
          />
          <div
            className="managementpanel__item__header"
            style={{ height: "80vh", overflow: "hidden" }}
          >
            <div id="cp-sessions" className="sessions">
              <div className="sessions__post management__form-container">
                <form action="submit" onSubmit={postSession}>
                  <label htmlFor="institution_name">Subject:</label>
                  <input
                    id="session_name"
                    autoComplete="off"
                    type="text"
                    name="session_name"
                    required
                  />
                  <label htmlFor="institution_name">Schedule:</label>
                  <div className="timeInputs">
                    <input id="start" name="start" type="time" required></input>
                    <input id="end" name="end" type="time" required></input>
                  </div>
                  <label htmlFor="institution_name">Streaming Link:</label>
                  <input
                    id="streaming"
                    autoComplete="off"
                    type="text"
                    name="streaming"
                    required
                  />
                  <label htmlFor="session_resources">Resources Link:</label>
                  <input
                    id="resources"
                    name="resources"
                    type="text"
                    required
                  ></input>
                  <label htmlFor="session_chat">Chat Link:</label>
                  <input id="chat" name="chat" type="text" required></input>
                  <label htmlFor="course_id">Course:</label>
                  <select name="course_id" id="course_id" required>
                    {courses.map((i) => {
                      return (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      );
                    })}
                  </select>
                  <button type="submit">SUBMIT</button>
                </form>
              </div>
              {/* <div className="sessions__delete management__form-container">
                                    <h3>DELETE A SESSION</h3>
                                    <form action="submit" onSubmit={deleteSession}>
                                        <select name="sessions" id="sessions_delete">
                                            {sessions.map((i) => {
                                                return <option value={i.id}>{i.name}</option>;
                                            })}
                                        </select>
                                        <button type="submit">DELETE</button>
                                    </form>
                                </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
