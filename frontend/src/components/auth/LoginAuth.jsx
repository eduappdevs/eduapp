import { useState } from "react";
import * as AUTH_SERVICE from "../../services/auth.service";
import BasicGoogleLogin from "../basicGoogleLogin/BasicGoogleLogin";
import StandardModal from "../modals/standard-modal/StandardModal";
import { Mailer } from "../Mailer";
import Notification from "../notifications/notifications";
import useLanguage from "../../hooks/useLanguage";

export default function LoginAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotModalShow, setForgotModalShow] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [emailSentModalShow, setEmailSentModalShow] = useState(false);

  const language = useLanguage();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = new FormData();

      userData.append("user[email]", email);
      userData.append("user[password]", password);

      await AUTH_SERVICE.login(userData);
    } catch (error) {
      console.log(error);
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
      <label htmlFor="email">{language.email}</label>
      <input
        data-testid="email"
        type="email"
        name="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        required
      />
      <label htmlFor="password">{language.password}</label>
      <input
        data-testid="password"
        type="password"
        name="password"
        onChange={(e) => {
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
            email={email}
            sendEmail={sendEmail}
          />
        }
        language={language}
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
        language={language}
        show={emailSentModalShow}
        onCloseAction={() => {
          setEmailSentModalShow(false);
        }}
      />
      <button data-testid="loginButton" type="submit">
        {language.login_title}
      </button>
      <span style={{ color: "white" }}>
        <br />
        {language.login_or}
      </span>
      <BasicGoogleLogin language={language} />
      <img src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="logo" />
    </form>
  );
}
