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
import { asynchronizeRequest } from "../../../API";
import * as USER_SERVICE from "../../../services/user.service";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import useRole from "../../../hooks/useRole";
import "./ProfileSettings.css";

export default function ProfileSettings() {
  let userInfo = FetchUserInfo(getOfflineUser().user.id);
  let isAdmin = useRole(userInfo, "eduapp-admin");
  let isTeacher = useRole(userInfo, "eduapp-teacher");
  let courses = GetCourses(getOfflineUser().user.id);

  const [userName, setUserName] = useState(null);
  const [changeImage, setChangeImage] = useState(null);
  const [displayImageWarning, setWarnDisplay] = useState("none");
  const [imageWarningText, setWarningText] = useState(
    "Image size is larger than 2MB"
  );
  const [saveText, setSaveText] = useState("SAVE CHANGES");
  const [showPopup, setPopup] = useState(false);

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
        asynchronizeRequest(function () {
          USER_SERVICE.editUserInfo(
            getOfflineUser().user.id,
            userFormData
          ).then(() => {
            updateUserImageOffline(url).then(() => {
              window.location.href = "/home";
            });
          });
        });
      });
    });
  };

  const switchSaveState = (state) => {
    if (state) {
      setSaveText("SAVING...");
      document
        .getElementById("commit-loader")
        .classList.remove("commit-loader-hide");
    } else {
      setSaveText("SAVE CHANGES");
      document
        .getElementById("commit-loader")
        .classList.add("commit-loader-hide");
    }
  };

  const commitChanges = (e) => {
    e.preventDefault();
    switchSaveState(true);

    const newUserInfo = new FormData();
    if (userName != null) {
      newUserInfo.append("user_name", userName);
    }

    let newImg = null;
    if (changeImage != null) {
      newImg = FirebaseStorage.getRef(
        "user_profiles/" + getOfflineUser().user.id + "/" + changeImage.name
      );
    }

    if (newImg) {
      list(
        FirebaseStorage.getRef("user_profiles/" + getOfflineUser().user.id)
      ).then((snap) => {
        if (snap.items.length !== 0) {
          deleteObject(snap.items[0]).then(() => {
            uploadImg(newImg, changeImage, newUserInfo);
          });
        } else uploadImg(newImg, changeImage, newUserInfo);
      });
    } else {
      asynchronizeRequest(async function () {
        USER_SERVICE.editUserInfo(getOfflineUser().user.id, newUserInfo).then(
          () => {
            window.location.href = "/home";
          }
        );
      }).then((error) => {
        if (error) {
          switchSaveState(false);
          setPopup(true);
        }
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
        <StandardModal
          show={showPopup}
          iconFill
          hasTransition
          hasIconAnimation
          type={"error"}
          text={"The profile information could not be saved."}
          onCloseAction={() => {
            setPopup(false);
          }}
        />
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
          <span>{saveText}</span>
          <svg
            id="commit-loader"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-repeat commit-loader-hide loader-spin"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            />
          </svg>
        </div>
        <GoogleLoginButton useType={"merge"} />
        {isAdmin && (
          <div className="youareadmin">
            <p>ADMIN</p> <img src="/assets/admin.svg" alt="teacher" />
          </div>
        )}
        <div className="coursesContainer">
          <img className="coursesLogo" src="/assets/book.svg" alt="book" />
          <ul className="coursesList">
            {courses.map((course) => {
              return (
                <li key={course.id} className="courseItem">
                  <p>{course.name}</p>
                  <img src="/assets/student.svg" alt="student" />
                  {/* {course.isTeacher ? (
                    <img src="/assets/teacher.svg" alt="teacher" />
                  ) : (
                    <img src="/assets/student.svg" alt="student" />
                  )} */}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
