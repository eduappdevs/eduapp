import React, { useState } from "react";
import axios from "axios";
import StandardModal from "../components/modals/standard-modal/StandardModal";
import { getOfflineUser } from "../utils/OfflineManager";
import * as AUTH_SERVICE from "../services/auth.service";
import useLanguage from "../hooks/useLanguage";

/**
 * Handles the change password process of a user.
 */
export default function ChangePasswordButton() {
  const language = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [formIndex, setFormIndex] = useState(0);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // message to show in alert modal
  const [alertType, setAlertType] = useState(null); // icon to show in alert modal

  const email = getOfflineUser().user.email;
  const forms = [
    <form className="standard-modal-form">
      <label htmlFor="old_password">{language.recovery_old_pswd}</label>
      <input
        id="old_password"
        name="old_password"
        type="password"
        placeholder={language.recovery_old_pswd}
      />
    </form>,
    <form id="submit_form" className="standard-modal-form">
      <label htmlFor="new_password">{language.recovery_new_pswd}</label>
      <input
        id="new_password"
        name="new_password"
        type="password"
        placeholder={language.recovery_new_pswd}
      />
      <label htmlFor="confirm_password">{language.recovery_confirm_pswd}</label>
      <input
        id="confirm_password"
        name="confirm_password"
        type="password"
        placeholder={language.recovery_confirm_pswd}
      />
      <label htmlFor="confirmation_code">
        {language.recovery_confirm_code}
      </label>
      <input
        id="confirmation_code"
        name="confirmation_code"
        type="password"
        placeholder={language.recovery_confirm_code}
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
          setAlertMessage(language.recovery_change_pswd_success);
          setAlertType("success");
          setTimeout(async () => await AUTH_SERVICE.logout(), 3000);
        } else {
          console.log(res);
          setShowModal(false);
          setTimeout(() => {
            setAlertMessage(language.recovery_change_pswd_error);
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
              ? language.recovery_invalid_code
              : language.recovery_change_pswd_error
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
          setAlertMessage(language.recovery_code_sent_success);
          setShowAlertModal(true);
          setShowModal(false);
          setTimeout(() => {
            setShowAlertModal(false);
            setShowModal(true);
            setFormIndex(formIndex + 1);
          }, 4000);
        } else {
          let invalidOldPwd =
            res.data.message === language.recovery_old_invalid;
          setShowModal(false);
          setTimeout(() => {
            setAlertMessage(
              invalidOldPwd
                ? language.recovery_incorrect_pswd
                : language.recovery_check_pswd_error
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
          setAlertMessage(language.recovery_unknown_error_ocurred);
          setAlertType("error");
          setShowAlertModal(true);
        }, 300);
      });
  };

  return (
    <>
      <button
        className="button changepassword_button"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        {language.change_password}
      </button>
      <StandardModal
        show={showModal}
        hasIconAnimation
        hasTransition
        type={"info"}
        text={
          !formIndex
            ? language.recovery_first_step
            : language.recovery_second_step
        }
        customOkay={!formIndex ? language.next : language.submit}
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
