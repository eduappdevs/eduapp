import React, { useState } from "react";
import axios from "axios";
import StandardModal from "../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../utils/OfflineManager";
import * as AUTH_SERVICE from "../services/auth.service";

export default function ChangePasswordButton() {
  const [showModal, setShowModal] = useState(false);
  const [formIndex, setFormIndex] = useState(0);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // message to show in alert modal
  const [alertType, setAlertType] = useState(null); // icon to show in alert modal

  const email = getOfflineUser().user.email;
  const forms = [
    <form className="standard-modal-form">
      <label htmlFor="old_password">Old password</label>
      <input
        id="old_password"
        name="old_password"
        type="password"
        placeholder="Old password"
      />
    </form>,
    <form id="submit_form" className="standard-modal-form">
      <label htmlFor="new_password">New password</label>
      <input
        id="new_password"
        name="new_password"
        type="password"
        placeholder="New password"
      />
      <label htmlFor="confirm_password">Confirm password</label>
      <input
        id="confirm_password"
        name="confirm_password"
        type="password"
        placeholder="Confirm password"
      />
      <label htmlFor="confirmation_code">Confirmation code</label>
      <input
        id="confirmation_code"
        name="confirmation_code"
        type="password"
        placeholder="Confirmation code"
      />
    </form>,
  ];

  const submit_password_change = () => {
    const new_password = document.getElementById("new_password").value;
    const confirm_password = document.getElementById("confirm_password").value;
    const confirmation_code =
      document.getElementById("confirmation_code").value;
    const req_location =
      process.env.REACT_APP_BACKEND_ENDPOINT +
      `/change_password_with_code?email=${email}&new_password=${btoa(
        new_password
      )}&confirm_password=${btoa(
        confirm_password
      )}&confirmation_code=${confirmation_code}`;
    axios
      .get(req_location)
      .then(async (res) => {
        if (res.data.status === "success") {
          setShowModal(false);
          setShowAlertModal(true);
          setAlertMessage("Password changed successfully");
          setAlertType("success");
          setTimeout(async () => await AUTH_SERVICE.logout(), 3000);
        } else {
          console.log(res);
          setShowModal(false);
          setTimeout(() => {
            setAlertMessage(
              "Something went wrong while trying to change your password. Please try again later."
            );
            setAlertType("error");
            setShowAlertModal(true);
          }, 300);
        }
      })
      .catch((err) => {
        let invalidCode = err.response.status === 422;
        setShowModal(false);
        setTimeout(() => {
          setAlertMessage(
            invalidCode
              ? "The code provided is not valid. Please try again later"
              : "Something went wrong while changing your password. Please try again later."
          );
          setAlertType("error");
          setShowAlertModal(true);
        }, 300);
        setTimeout(() => window.location.reload(), 4500);
      });
    setShowModal(false);
  };

  const begin_password_change = () => {
    const old_password = document.getElementById("old_password").value;
    const req_location =
      process.env.REACT_APP_BACKEND_ENDPOINT +
      `/send_change_password_instructions?old_password=${old_password}&email=${email}`;
    axios
      .get(req_location)
      .then((res) => {
        if (res.data.status === "success") {
          document.getElementById("old_password").value = "";
          setAlertType("warning");
          setAlertMessage("Check your email for the confirmation code");
          setShowAlertModal(true);
          setShowModal(false);
          setTimeout(() => {
            setShowAlertModal(false);
            setShowModal(true);
            setFormIndex(formIndex + 1);
          }, 4000);
        } else {
          let invalidOldPwd = res.data.message === "Invalid old password";
          setShowModal(false);
          setTimeout(() => {
            setAlertMessage(
              invalidOldPwd
                ? "The password you entered is incorrect. Please try again."
                : "Something went wrong when checking your password. Please try again later."
            );
            setAlertType("error");
            setShowAlertModal(true);
          }, 300);
        }
      })
      .catch((err) => {
        console.error(err);
        setShowModal(false);
        setTimeout(() => {
          setAlertMessage("An error occurred. Please try again later.");
          setAlertType("error");
          setShowAlertModal(true);
        }, 300);
      });
  };

  return (
    <>
      <button
        className="button"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        Change password
      </button>
      <StandardModal
        show={showModal}
        hasIconAnimation
        hasTransition
        type={"info"}
        text={!formIndex ? "1st step" : "2nd step"}
        customOkay={!formIndex ? "Next" : "Submit"}
        onCloseAction={
          !formIndex ? begin_password_change : submit_password_change
        }
        hasCancel
        onCancelAction={() => setShowModal(false)}
        form={forms[formIndex]}
      />
      <StandardModal
        type={alertType}
        showLoader={alertType === "warning"}
        hasIconAnimation
        hasTransition
        show={showAlertModal}
        text={alertMessage}
        onCloseAction={() => setShowAlertModal(false)}
      />
    </>
  );
}
