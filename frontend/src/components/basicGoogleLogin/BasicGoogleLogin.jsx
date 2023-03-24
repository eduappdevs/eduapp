import { GoogleLogin } from "react-google-login";
import * as AUTHSERVICE from "../../services/auth.service";

/**
 * A component used for logining in with google for the login page.
 *
 * @param {Object} language The language to use.
 */
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
