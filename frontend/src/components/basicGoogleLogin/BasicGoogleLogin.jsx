import { GoogleLogin } from "react-google-login";
import GoogleSettings, { asynchronizeRequest } from "../../API";
import * as AUTH_SERVICE from "../../services/auth.service";
import * as TUITION_SERVICE from "../../services/enrollment.service";
import * as USER_SERVICE from "../../services/user.service";

/**
 * A component used for logining in with google for the login page.
 *
 * @param {Object} language The language to use.
 */
export default function BasicGoogleLogin({ language }) {
  const responseGoogle = async (response) => {
    try {
      const google = await GoogleSettings.chechToken(response.accessToken);

      if (!google.email) {
        throw new Error("Google account is not verified");
      } else {
        const formData = new FormData();

        formData.append("user[email]", google.email);
        formData.append("user[password]", response.profileObj.googleId);

        await AUTH_SERVICE.login(formData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const userEnroll = async (uId) => {
  //   const payload = new FormData();
  //   payload.append("course_id", 1);
  //   payload.append("user_id", uId);

  //   await TUITION_SERVICE.createTuition(payload);
  // };

  // const registerGoogle = async (response) => {
  //   try {
  //     const google = await GoogleSettings.chechToken(response.accessToken);

  //     if (!google.email) {
  //       throw new Error("Google account is not verified");
  //     } else {
  //       const payload = new FormData();

  //       payload.append("user[email]", google.email);
  //       payload.append("user[password]", response.profileObj.googleId);

  //       asynchronizeRequest(async function () {
  //         const newUser = await USER_SERVICE.createUser(payload);

  //         const enroll = new FormData();
  //         enroll.append("user_id", newUser.data.message.id);
  //         enroll.append("user_name", newUser.data.message.email.split("@")[0]);
  //         enroll.append("user_role", "eduapp-student");
  //         userEnroll(newUser.data.message.id);

  //         await AUTH_SERVICE.login(payload);
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="googleButton">
      <GoogleLogin
        clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
        buttonText={language.login_google}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />

      {/* <GoogleLogin
        clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
        buttonText={"Register with google"}
        onSuccess={registerGoogle}
        onFailure={registerGoogle}
        cookiePolicy={"single_host_origin"}
      /> */}
    </div>
  );
}
