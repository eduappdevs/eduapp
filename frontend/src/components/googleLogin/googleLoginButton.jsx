import React from 'react'
import './googleLogin.css'
import { GoogleLogin } from 'react-google-login';
import API from "../../API";
import { FetchUserInfo } from '../../hooks/FetchUserInfo';



let finalData = new FormData();
export default function GoogleLoginButton(useType) {
    let userInfo = FetchUserInfo(localStorage.userId);



    const getInfo = (data) => {
        let prf = data.profileObj
        let googleId = data.googleId;

        return [prf, googleId]
    }
    const linkGoogle = (res) => {
        let info = getInfo(res);
        finalData.append('googleid', info[1])
        API.addGoogleId(userInfo.id, finalData);
       

    }
    const unlinkGoogle = ()=>{
        finalData.append('googleid', '')
        API.unlinkGoogleId(userInfo.id, finalData);

    }
    const loginGoogle = (res) => {
        let info = getInfo(res);
        let googleid = info[1];
        API.loginWithGoogle(googleid);
        console.log('this suppose to work, googleid = ',googleid)
        

    }
    const responseGoogle = (response) => {
        console.log(response)
    }




    return userInfo && (
        <div className="googleButton">
            {userInfo.isLoggedWithGoogle ?
                <div className="googleAccountInfo">
                    <div onClick={unlinkGoogle} className="unlinkGoogle">
                        <span className='unlinkGoogleButton'> <img src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_"G"_Logo.svg'/> Unlink</span>
                    </div>
                    <span className='googleid-span'>Google id : {userInfo.googleid}</span>


                </div>

                :
                <GoogleLogin
                    clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
                    buttonText={useType.useType == 'merge' ? "Link" : "Login"}
                    onSuccess={useType.useType == 'merge' ? linkGoogle : loginGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}

                />

            }


        </div>
    )
}
