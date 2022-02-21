import React from 'react'
import './googleLogin.css'
import { GoogleLogin } from 'react-google-login';
import { useEffect } from 'react';


export default function GoogleLoginButton(useType) {
    const getInfo = (data) => {
        let prf = data.profileObj
        let name = prf.name
        let email = prf.email
        let img = prf.imageUrl

        console.log(prf)
        
        return [prf,name,email,img]
	}
    const mergeGoogle = (res)=>{
        let info = getInfo(res);

    }
    const loginGoogle = (res)=>{
        let info = getInfo(res);

    }
    const responseGoogle = (response)=>{
        console.log(response)
    }




    return (
        <div className="googleButton">
           
            <GoogleLogin
                clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
                buttonText={useType.useType == 'merge' ? "Link" : "Login"}
                onSuccess={useType.useType == 'merge' ? mergeGoogle : loginGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                
            />
        </div>
    )
}
