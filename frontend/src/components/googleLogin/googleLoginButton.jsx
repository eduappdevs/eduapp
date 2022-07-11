import React from "react";
import { GoogleLogin } from "react-google-login";
import * as USER_SERVICE from "../../services/user.service";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import { getOfflineUser } from "../../utils/OfflineManager";
import useLanguage from "../../hooks/useLanguage";
import "./googleLogin.css";

let finalData = new FormData();

/**
 * A component used for logining in with google.
 *
 * @param {String} useType How the button is going to be used (link, login).
 */
export default function GoogleLoginButton(useType) {
  const language = useLanguage();
  let userInfo = FetchUserInfo(getOfflineUser().user.id);

  const getInfo = (data) => {
    return [data.profileObj, data.googleId];
  };

  const linkGoogle = async (res) => {
    let info = getInfo(res);
    finalData.append("googleid", info[1]);
    await USER_SERVICE.addGoogleId(userInfo.id, finalData);
    window.location.reload();
  };

  const unlinkGoogle = async () => {
    finalData.append("googleid", "");
    await USER_SERVICE.unlinkGoogleId(userInfo.id, finalData);
    window.location.reload();
  };

  const loginGoogle = async (res) => {
    await USER_SERVICE.googleLogin(res);
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    userInfo && (
      <div className="googleButton">
        {userInfo.isLoggedWithGoogle ? (
          <div className="googleAccountInfo">
            <div onClick={unlinkGoogle} className="unlinkGoogle">
              <span className="unlinkGoogleButton">
                <img
                  alt=""
                  src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_"G"_Logo.svg'
                />
                {language.unlink}
              </span>
            </div>
          </div>
        ) : (
          <GoogleLogin
            clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
            buttonText={
              useType.useType === "merge" ? language.link : language.login_title
            }
            onSuccess={useType.useType === "merge" ? linkGoogle : loginGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        )}
      </div>
    )
  );
}
