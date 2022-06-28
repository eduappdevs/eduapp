import React from "react";
import { GoogleLogin } from "react-google-login";
import * as AUTHSERVICE from "../../services/auth.service";

export default function BasicGoogleLogin({ language }) {
  const responseGoogle = async (response) => {
    try {
      const gid = response.googleId;
      await AUTHSERVICE.login_with_google({ gid: gid });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="googleButton">
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText={language.login_google}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}
