import React, { useState } from "react";
import axios from "axios";
import StandardModal from "../../components/modals/standard-modal/StandardModal";
import useLanguage from "../../hooks/useLanguage";
import "./PasswordRecovery.css";

export default function PasswordRecovery() {
  const language = useLanguage();
  const urlParams = new URLSearchParams(window.location.search);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("");
  const [customOkay, setCustomOkay] = useState(false);
  const email = urlParams.get("email");
  const token = urlParams.get("token");

  const handleChange = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case "password":
        setPassword(e.target.value);
        break;
      case "confirm-password":
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };
  const reset_password = (e) => {
    e.preventDefault();
    console.log({
      email: email,
      token: token,
      password: password,
      confirmPassword: confirmPassword,
    });
    if (password === confirmPassword) {
      let http_request_url = `http://localhost:3000/password/reset?email=${email}&token=${token}&password=${password}&password_confirmation=${confirmPassword}`;
      axios
        .post(http_request_url)
        .then((res) => {
          if (res.data.status === "success") {
            setModalMessage(language.recovery_pswd_reset_success);
            setCustomOkay(language.recovery_goto_login);
            setModalIcon("success");
            setModalShow(true);
          } else {
            setModalMessage(language.recovery_pswd_reset_error);
            setModalShow(true);
            setModalIcon("error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setModalMessage(language.recovery_pswd_confirm_mismatch);
      setModalShow(true);
      setModalIcon("error");
    }
  };
  return (
    <>
      <StandardModal
        show={modalShow}
        text={modalMessage}
        customOkay={customOkay}
        onCloseAction={() => {
          setModalShow(false);
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }}
        hasTransition
        hasIconAnimation
        type={modalIcon}
      />
      <div className="pr-container">
        <div className="pr-header">
          <div className="pr-header-logo">
            <img src="/assets/logo.png" alt="logo" />
          </div>
          <h1>{language.recover_title}</h1>
          <h2>{language.recovery_description}</h2>
          <h1 className="pr-email" id="pr-email">
            {email ? email : language.recovery_email_token_missing}
          </h1>
        </div>
        <div className="pr-body">
          <form>
            <label htmlFor="password">{language.recovery_new_pswd}</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder={language.recovery_new_pswd}
              autoComplete="new-password"
            />
            <label htmlFor="password">{language.recovery_confirm_pswd}</label>
            <input
              type="password"
              onChange={handleChange}
              id="confirm-password"
              name="confirm-password"
              autoComplete="off"
              placeholder={language.recovery_confirm_pswd}
            />

            <button
              type="button"
              onClick={
                (password != "") & (confirmPassword != "") && reset_password
              }
              className="pr-button"
            >
              {language.reset}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
