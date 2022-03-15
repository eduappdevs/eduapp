import { React, useState } from "react";
import MenuHeader from "../menuHeader/MenuHeader";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { GetCourses } from "../../../hooks/GetCourses";
import API from "../../../API";
import Loader from "../../../components/loader/Loader";
import "./ProfileSettings.css";
import GoogleLoginButton from "../../../components/googleLogin/googleLoginButton";

export default function ProfileSettings() {
  let userInfo = FetchUserInfo(localStorage.userId);
  let courses = GetCourses();

  const [userName, setUserName] = useState(null);
  const [changeImage, setChangeImage] = useState(null);

  const closeProfileSettings = () => {
    document
      .getElementsByClassName("profileSettings_container")[0]
      .classList.add("profileSettings__hidden");
  };

  const changeImagePreview = (newPreview) => {
    console.log(newPreview);
    if (newPreview.target.files && newPreview.target.files[0]) {
      document
        .getElementById("profileImage_preview")
        .setAttribute(
          "src",
          window.URL.createObjectURL(newPreview.target.files[0])
        );
    }
    setChangeImage(newPreview.target.files[0]);
  };

  const commitChanges = (e) => {
    e.preventDefault();

    const newUserInfo = new FormData();
    if (changeImage != null) {
      newUserInfo.append("profile_image", changeImage);
    }

    if (userName != null) {
      newUserInfo.append("user_name", userName);
    }

    API.updateInfo(localStorage.userId, newUserInfo).then(() => {
      window.location.reload();
    });
  };

  return courses !== undefined ? (
    <div className="profileSettings_container profileSettings__hidden">
      <MenuHeader
        backTo={() => {
          closeProfileSettings();
        }}
        location={"PROFILE"}
      />
      <div className="profileSettings_wrapper">
        {userInfo && (
          <div className="userProfileImg">
            <img
              src={
                userInfo.profile_image != null
                  ? userInfo.profile_image.url
                  : "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
              }
              alt={"user"}
              className="profileImage_preview"
              id="profileImage_preview"
              onClick={() => {
                document.getElementById("profileImage_upload").click();
              }}
            />
            <input
              type="file"
              name="profile_image"
              id="profileImage_upload"
              onChange={changeImagePreview}
            />
          </div>
        )}
        <div className="userName_input">
          <input
            type="text"
            defaultValue={userInfo.user_name}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="commitChanges" onClick={commitChanges}>
          <span>SAVE CHANGES</span>
        </div>
        <GoogleLoginButton useType={"merge"} />
        {userInfo.isAdmin && (
          <div className="youareadmin">
            <p>ADMIN</p> <img src="/assets/admin.svg" alt="teacher" />
          </div>
        )}
        <div className="coursesContainer">
          <img className="coursesLogo" src="/assets/book.svg" alt="book" />
          <ul className="coursesList">
            {courses.map((course) => {
              return (
                <li className="courseItem">
                  <p>{course.course.name}</p>
                  {course.isTeacher ? (
                    <img src="/assets/teacher.svg" alt="teacher" />
                  ) : (
                    <img src="/assets/student.svg" alt="student" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}
