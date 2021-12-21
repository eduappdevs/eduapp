import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../API";
import "../styles/controlPanel.css";
let institutions;
let courses;
let users;

export default function ControlPanel() {
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const fetchInstitutions = async () => {
    try {
      await API.fetchInstitutions().then((res) => {
        institutions = res.data;
        setInstitutionsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getInstitution = (id) => {
    let res;
    institutions.map((i) => {
      if (i.id === id) {
        res = i.name;
      }
    });
    return res;
  };
  const fetchUsers = async () => {
    try {
      await API.fetchUserInfos().then((res) => {
        users = res.data;
        setUsersLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCourses = async () => {
    try {
      await API.fetchCourses().then((res) => {
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
    API.createInstitution(payload);
    window.location.reload();
  };
  const postCourse = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", e.target.name.value);
    payload.append("institution_id", e.target.institution_id.value);

    API.createCourse(payload);
    window.location.reload();
  };
  const deleteInstitution = (event) => {
    event.preventDefault();
    API.deleteInstitution(event.target.institutions.value);
    window.location.reload();
  };
  const deleteCourse = (id) => {
    console.log(id);
    // API.deleteCourse(id);
  };
  const createUser = (event) => {
    event.preventDefault();
    let isAdmin = event.target.isAdmin.checked
    const payload = new FormData();
    payload.append("user[email]", event.target.email.value);
    payload.append("user[password]", event.target.password.value);
    API.createUser(payload)
      .then((res) => {
        const payload = new FormData();
        API.createInfo(payload);
        payload.delete("user[email]");
        payload.delete("user[password]");
        payload.append("user_id", res.data.message.id);
        payload.append("user_name", res.data.message.email.split("@")[0]);
        payload.append("isAdmin", isAdmin);

        API.createInfo(payload).then((res) => {
          window.location.reload();
        });
      })
      .catch((err) => console.log);
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
    payload.append("isTeacher",e.target.isTeacher.checked);

    API.enrollUser(payload).then((res) => {
      console.log("User tuition has been completed successfully!");
    });
  };
  useEffect(() => {
    fetchInstitutions();
    fetchCourses();
    fetchUsers();
  }, []);
  return !institutionsLoading &&
    institutions !== undefined &&
    !coursesLoading &&
    courses !== undefined &&
    !usersLoading &&
    users !== undefined ? (
    <>
      <Navbar />
      {console.log("aqui", institutions)}
      <div className="cp-container">
        <div id="cp-institutions" className="institutions">
          <h1>INSTITUTIONS</h1>
          <div className="institutions__post">
            <h3>CREATE A INSTITUTION</h3>
            <form action="submit" onSubmit={postInstitution}>
              <label htmlFor="institution_name">Institution name</label>
              <input type="text" name="institution_name" required />
              <button type="submit">SUBMIT</button>
            </form>
          </div>
          <div className="institutions__delete">
            <h3>DELETE A INSTITUTION</h3>
            <form action="submit" onSubmit={deleteInstitution}>
              <select name="institutions" id="institutions_delete">
                {institutions.map((i) => {
                  return <option value={i.id}>{i.name}</option>;
                })}
              </select>
              <button type="submit">DELETE</button>
            </form>
          </div>
        </div>
        <div id="cp-courses" className="courses hidden">
          <h1>COURSES</h1>
          <div className="courses__post">
            <h3>CREATE A COURSE</h3>
            <form action="submit" onSubmit={postCourse}>
              <input type="text" name="name" />
              <select name="institution_id" id="institution_id">
                {institutions.map((i) => {
                  return <option value={i.id}>{i.name}</option>;
                })}
              </select>
              <button type="submit">SUBMIT</button>
            </form>
          </div>
          <div className="courses__delete">
            <h3>DELETE A COURSE</h3>
            <form action="submit" onSubmit={deleteCourse}>
              <select name="courses" id="courses_delete">
                {courses.map((i) => {
                  return <option value={i.id}>{i.name}</option>;
                })}
              </select>
              <button type="submit">DELETE</button>
            </form>
          </div>
          <div className="courses__edit"></div>
        </div>
        <div id="cp-users" className="users hidden">
          <h1>USERS</h1>
          <div className="users__post">
            <form action="submit" onSubmit={createUser}>
              <label htmlFor="email">Email </label>
              <input type="text" name="email" />
              <label htmlFor="password">Password</label>
              <input type="password" name="password" />
              <label htmlFor="isAdmin">Admin</label>
              <input type="checkbox" name="isAdmin" id="isAdmin" value='isAdmin'/>  
              <button type="submit">SIGN UP</button>
            </form>
          </div>
          <div className="user_tuition">
            <h1>ENROLL</h1>
            <form action="submit" onSubmit={userEnroll}>
              <p>Course</p>
              <select name="tuition_course" id="tuition_course">
                {courses.map((i) => {
                  return (
                    <option
                      value={i.name + ":" + i.id + "/" + i.institution_id}
                    >
                      {i.name} of {getInstitution(i.institution_id)}
                    </option>
                  );
                })}
              </select>
              <p>User</p>

              <select name="tuition_user" id="tuition_user">
                {users.map((i) => {
                  return (
                    <option value={i.id}>
                      {i.user_name},{i.id}
                    </option>
                  );
                })}
              </select> 
              <label htmlFor="isTeacher">Teacher</label>
              <input type="checkbox" name="isTeacher" id="isTeacher" value='isTeacher'/>             
              <button type="submit">ENROLL</button>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : (
    "loading"
  );
}
