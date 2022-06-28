import React from "react";
import { GoogleLogin } from "react-google-login";
import * as AUTHSERVICE from "../../services/auth.service";
import { getOfflineUser } from "../../utils/OfflineManager";
import useLanguage from "../../hooks/useLanguage";
import "./googleLogin.css";

export default function GoogleLoginButton(useType) {
  const language = useLanguage();
  let user = getOfflineUser().user;

  const linkGoogle = async (res) => {
    let gid = res.googleId;
    await AUTHSERVICE.link_with_google({ user_id: user.id, gid: gid });
  };

  const unlinkGoogle = async () => {
    await AUTHSERVICE.unlink_with_google({ user_id: user.id });
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    user && (
      <div className="googleButton">
        {user.encrypted_googleid && user.encrypted_googleid.length > 0 ? (
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
            onSuccess={linkGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        )}
      </div>
    )
  );
}
