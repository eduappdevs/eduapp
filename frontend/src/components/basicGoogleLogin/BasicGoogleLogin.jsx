import React from "react";
import { GoogleLogin } from "react-google-login";
import API, { asynchronizeRequest } from "../../API";

export default function BasicGoogleLogin() {
  const responseGoogle = async (response) => {
    try {
      const google = await API.chechToken(response.accessToken);

      if (!google.email) {
        throw new Error("Google account is not verified");
      } else {
        const formData = new FormData();

        formData.append("user[email]", google.email);
        formData.append("user[password]", response.profileObj.googleId);

        await API.login(formData).then(() => {
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userEnroll = (uId) => {
    const payload = new FormData();
    payload.append("course_id", 1);
    payload.append("user_id", uId);

    API.default.enrollUser(payload).then(() => {
      console.log("User tuition has been completed successfully!");
    });
  };
  const registerGoogle = async (response) => {
    try {
      const google = await API.chechToken(response.accessToken);

      if (!google.email) {
        throw new Error("Google account is not verified");
      } else {
        const payload = new FormData();

        payload.append("user[email]", google.email);
        payload.append("user[password]", response.profileObj.googleId);

        asynchronizeRequest(function () {
          API.createUser(payload).then((res) => {
            const payload = new FormData();
            payload.append("user_id", res.data.message.id);
            payload.append("user_name", res.data.message.email.split("@")[0]);
            payload.append("user_role", "eduapp-student");
            userEnroll(res.data.message.id);

            const userData = new FormData();

            userData.append("user[email]", google.email);
            userData.append("user[password]", response.profileObj.googleId);

            API.login(userData).then((res) => {
              console.log(res);
              window.location.href = "/";
            });
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="googleButton">
      <GoogleLogin
        clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
        buttonText={"Login with google"}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />

      <GoogleLogin
        clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
        buttonText={"Register with google"}
        onSuccess={registerGoogle}
        onFailure={registerGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}
