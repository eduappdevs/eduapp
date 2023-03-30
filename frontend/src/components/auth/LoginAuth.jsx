import { useState } from "react";
import * as AUTH_SERVICE from "../../services/auth.service";
// import BasicGoogleLogin from "../basicGoogleLogin/BasicGoogleLogin";
import StandardModal from "../modals/standard-modal/StandardModal";
import { Mailer } from "../Mailer";
import Notification from "../notifications/notifications";
import useLanguage from "../../hooks/useLanguage";

/**
 * A login form component for login in users.
 */
export default function LoginAuth() {
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [forgotModalShow, setForgotModalShow] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailSentModalShow, setEmailSentModalShow] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const language = useLanguage();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = new FormData();

      userData.append(`user[login]`, login);
      userData.append("user[password]", password);

      await AUTH_SERVICE.login(userData);
    } catch (error) {
      setLoginError(true);
      console.log("here", error);
    }
  };

  const showEmailSentModal = () => {
    setTimeout(() => {
      new Notification(language.recovery_sent_success);
    }, 1000);
    setEmailSentModalShow(true);
  };

  return (
    <form className="login_form" onSubmit={handleSubmit}>
      <h1>{language.login_title}</h1>
      <label htmlFor="login">{language.email}</label>
      <input
        data-testid="login"
        type="text"
        name="login"
        onChange={(e) => {
          loginError && setLoginError(false);
          setLogin(e.target.value);
        }}
      />
      <label htmlFor="password">{language.password}</label>
      <input
        data-testid="password"
        type="password"
        name="password"
        onChange={(e) => {
          loginError && setLoginError(false);
          setPassword(e.target.value);
        }}
        required
      />
      <div
        onClick={() => {
          setForgotModalShow(true);
        }}
        className="forgottenPassword"
      >
        {language.forgot_password}
      </div>
      <StandardModal
        type={"info"}
        text={language.recovery_askemail}
        form={
          <Mailer
            language={language}
            showEmailSentModal={showEmailSentModal}
            sendEmail={sendEmail}
          />
        }
        show={forgotModalShow}
        onCloseAction={() => {
          setForgotModalShow(false);
          setSendEmail(true);
        }}
        hasIconAnimation
        hasTransition
        hasCancel
        onCancelAction={() => {
          window.location.reload();
        }}
      />
      <StandardModal
        type={"success"}
        text={language.recovery_sent_success}
        hasIconAnimation
        hasTransition
        show={emailSentModalShow}
        onCloseAction={() => {
          setEmailSentModalShow(false);
        }}
      />
      {loginError ? (<div class="error">User or password is incorrect.</div>): null }
      <button data-testid="loginButton" type="submit">
        {language.login_title}
      </button>

      {/* 
      UNCOMMENT to use Google Login
      <span style={{ color: "white" }}>
        <br />
        {language.login_or}
      </span>
      <BasicGoogleLogin language={language} />*/}
      <img src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="logo" /> 

    </form>
  );
}
