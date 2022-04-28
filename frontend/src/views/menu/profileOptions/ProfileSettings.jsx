import { useState } from "react";
import {
  uploadBytes,
  deleteObject,
  list,
  getDownloadURL,
} from "firebase/storage";
import MenuHeader from "../menuHeader/MenuHeader";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { GetCourses } from "../../../hooks/GetCourses";
import GoogleLoginButton from "../../../components/googleLogin/googleLoginButton";
import NameCapitalizer from "../../../utils/NameCapitalizer";
import {
  getOfflineUser,
  updateUserImageOffline,
} from "../../../utils/OfflineManager";
import FirebaseStorage from "../../../utils/FirebaseStorage";
import API from "../../../API";
import "./ProfileSettings.css";

export default function ProfileSettings() {
  let userInfo = FetchUserInfo(localStorage.userId);
  let courses = GetCourses();

  const [userName, setUserName] = useState(null);
  const [changeImage, setChangeImage] = useState(null);
  const [displayImageWarning, setWarnDisplay] = useState("none");
  const [imageWarningText, setWarningText] = useState(
    "Image size is larger than 2MB"
  );

  const changeImagePreview = (newPreview) => {
    const imageRegex = new RegExp("^.*(jpg|JPG|gif|GIF|png|PNG|jpeg|jfif)$");
    if (imageRegex.test(newPreview.target.files[0].name)) {
      setWarnDisplay("none");
      if (newPreview.target.files && newPreview.target.files[0]) {
        if (newPreview.target.files[0].size / 1000 / 1000 < 2) {
          document
            .getElementById("profileImage_preview")
            .setAttribute(
              "src",
              window.URL.createObjectURL(newPreview.target.files[0])
            );
          setWarnDisplay("none");
          setChangeImage(newPreview.target.files[0]);
        } else displayWarning("Image size is larger than 2MB");
      } else displayWarning("No provided image");
    } else displayWarning("File is not an image");
  };

  const displayWarning = (text) => {
    setWarningText(text);
    setWarnDisplay("block");
    setTimeout(() => {
      setWarnDisplay("none");
    }, 2000);
  };

  const uploadImg = (imgRef, newImg, userFormData) => {
    uploadBytes(imgRef, newImg).then((snap) => {
      getDownloadURL(snap.ref).then((url) => {
        userFormData.append("profile_image", url);
        API.updateInfo(localStorage.userId, userFormData).then(() => {
          updateUserImageOffline(url).then(() => {
            window.location.href = "/home";
          });
        });
      });
    });
  };

  const commitChanges = (e) => {
    e.preventDefault();

    const newUserInfo = new FormData();
    if (userName != null) {
      newUserInfo.append("user_name", userName);
    }

    let newImg = null;
    if (changeImage != null) {
      newImg = FirebaseStorage.getRef(
        "user_profiles/" +
          JSON.parse(localStorage.offline_user).user_id +
          "/" +
          changeImage.name
      );
    }

    if (newImg) {
      list(
        FirebaseStorage.getRef(
          "user_profiles/" + JSON.parse(localStorage.offline_user).user_id
        )
      ).then((snap) => {
        if (snap.items.length !== 0) {
          deleteObject(snap.items[0]).then(() => {
            uploadImg(newImg, changeImage, newUserInfo);
          });
        } else uploadImg(newImg, changeImage, newUserInfo);
      });
    } else {
      API.updateInfo(localStorage.userId, newUserInfo).then((res) => {
        window.location.href = "/home";
      });
    }
  };

  return (
    <div className="profileSettings_container">
      <MenuHeader
        backTo={() => {
          window.location.href = "/menu";
        }}
        location={"PROFILE"}
      />
      <div className="profileSettings_wrapper">
        {userInfo && (
          <div className="userProfileImg">
            <img
              src={
                getOfflineUser().profile_image != null
                  ? getOfflineUser().profile_image
                  : "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
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
        <div
          className="userName_input"
          style={{
            marginBottom: displayImageWarning === "none" ? "30px" : "0",
          }}
        >
          <input
            type="text"
            value={
              userName === null
                ? NameCapitalizer(
                    userInfo.user_name === undefined ? "" : userInfo.user_name
                  )
                : userName
            }
            onChange={(e) => {
              setUserName(
                e.target.value.includes(" ")
                  ? NameCapitalizer(e.target.value)
                  : e.target.value
              );
            }}
          />
        </div>
        <div
          className="file-size-warning"
          style={{ display: displayImageWarning }}
        >
          <p>{imageWarningText}</p>
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
                <li key={course.course.id} className="courseItem">
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
  );
}
