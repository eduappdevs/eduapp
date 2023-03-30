import { useEffect, useState } from "react";
import {
  uploadBytes,
  deleteObject,
  list,
  getDownloadURL,
} from "firebase/storage";
import MenuHeader from "../menuHeader/MenuHeader";
import { FetchUserInfo } from "../../../hooks/FetchUserInfo";
import { GetCourses } from "../../../hooks/GetCourses";
import GoogleLoginButton from "../../../components/googleLogin/googleLinkButton";
import {
  getOfflineUser,
  updateUserImageOffline,
} from "../../../utils/OfflineManager";
import FirebaseStorage from "../../../utils/FirebaseStorage";
import { asynchronizeRequest } from "../../../API";
import * as USER_SERVICE from "../../../services/user.service";
import StandardModal from "../../../components/modals/standard-modal/StandardModal";
import ChangePasswordButton from "../../../components/ChangePasswordButton";
import useRole from "../../../hooks/useRole";
import useLanguage from "../../../hooks/useLanguage";
import "./ProfileSettings.css";
import useMobile from "../../../hooks/useMobile";
import NameCapitalizer from "../../../utils/NameCapitalizer";
// import * as SUBJECTUSERSERVICE from "../../../services/subject_user.service";
import * as SUBJECTS_SERVICE from "../../../services/subject.service";

export default function ProfileSettings({ desktopBackTo }) {
  const language = useLanguage();
  let user = getOfflineUser().user;
  let userInfo = FetchUserInfo(user.id);
  let isAdmin = useRole(userInfo, "eduapp-admin");
  let isTeacher = useRole(userInfo, "eduapp-teacher");
  let courses = GetCourses(user.id);

  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [changeImage, setChangeImage] = useState(null);
  const [displayImageWarning, setWarnDisplay] = useState("none");
  const [imageWarningText, setWarningText] = useState(language.image_too_big);
  const [saveText, setSaveText] = useState(language.save);
  const [showPopup, setPopup] = useState(false);
  const [changesUnsaved, setChangesUnsaved] = useState(false);
  const [enrollments, setEnrollments] = useState();
  const [userInfos, setUserInfos] = useState();

  const fetchUserInfo = async () => {
    let userInfos = await USER_SERVICE.findById(user.id);
    setUserInfos(userInfos.data[0]);
  };

  const fetchUserSubjectUsers = async () => {
    let subjects = await SUBJECTS_SERVICE.fetchUserSubjects(user.id);
    if (subjects){
      console.log(subjects)
    }
    setEnrollments(subjects.data);
  };

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
          setChangesUnsaved(true);
        } else displayWarning(language.image_too_big);
      } else displayWarning(language.chat_no_image);
    } else displayWarning(language.file_not_image);
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
          USER_SERVICE.editUserInfo(user.id, userFormData).then(() => {
            updateUserImageOffline(url).then(() => {
              window.location.reload();
            });
          });
        });
      });
    });
  };

  const switchSaveState = (state) => {
    if (state) {
      setSaveText(language.saving);
      document
        .getElementById("commit-loader")
        .classList.remove("commit-loader-hide");
    } else {
      setSaveText(language.save);
      document
        .getElementById("commit-loader")
        .classList.add("commit-loader-hide");
    }
  };

  const commitChanges = (e) => {
    e.preventDefault();
    switchSaveState(true);

    const newUserInfo = new FormData();
    if (username) {
      newUserInfo.append("username", username);
    }
    if (name) {
      newUserInfo.append("name", name);
    }
    if (surname) {
      newUserInfo.append("surname", surname);
    }

    if(changeImage != null){
      newUserInfo.append("profile_image", changeImage);
    }

    asynchronizeRequest(async function () {
      try {
        USER_SERVICE.editUserInfo(user.id, newUserInfo).then(({data}) => {
          updateUserImageOffline(data.profile_image.url).then(() => {
          setChangesUnsaved(true);
          window.location.reload();
          window.location.href = "/";
          });
        });
      } catch (error) {
        if (error) {
          switchSaveState(false);
          setPopup(true);
        }
      }
    }).catch((error) => {});
  };

  useEffect(() => {
    setSaveText(language.save);
    fetchUserSubjectUsers();
    fetchUserInfo();
  }, [language.save]);

  return (
    <div className="profileSettings_container">
      <MenuHeader
        backTo={() => {
          window.location.href = "/";
        }}
        location={language.menu_profile}
      />
      <div className="profileSettings_wrapper">
        <StandardModal
          show={showPopup}
          iconFill
          hasTransition
          hasIconAnimation
          type={"error"}
          text={language.menu_profile_error}
          onCloseAction={() => {
            setPopup(false);
          }}
        />
        {userInfo && (
          <div className="userProfileImg">
            <img
              src={
                getOfflineUser().profile_image.url != null
                  ? getOfflineUser().profile_image.url
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
              username === null
                ? NameCapitalizer(
                    userInfo.user_name === undefined ? "" : userInfo.user_name
                  )
                : username
            }
            onChange={(e) => {
              setUsername(
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
          {/* reload_icon */}
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
        <ChangePasswordButton />

        {/* UNCOMMENT to use Google Login
        <GoogleLoginButton useType={"merge"} /> */}

        {isAdmin && (
          <div className="youareadmin">
            <p>ADMIN</p> <img src="/assets/admin.svg" alt="teacher" />
          </div>
        )}
        {/* TODO: crear otro componente */}
        <div className="coursesContainer">
          <img className="coursesLogo" src="/assets/book.svg" alt="book" />
          <ul className="coursesList">
            {enrollments && enrollments.map((enroll) => {
              return (
                <li key={enroll.id} className="courseItem">
                  <p>{enroll.name} - {enroll.subject_code}</p>
                  {userInfos?.user_role.name === ("eduapp-admin" || "eduapp-teacher") ? (
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
