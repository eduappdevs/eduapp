import axios from 'axios'
import React from 'react'
import "./login.css"
function login(e){
    e.preventDefault()
    let username = e.target[0].value
    let password = e.target[1].value
    console.log(username, password)
    axios.post("http://localhost:3000/users/sign_in",{origin:'http://localhost:3000'})
    .then(console.log)
    .catch(console.warn)
}
export default function Login() {
    return (
        
        <div className="loginSection">
            <div className="loginForm">
                <form action="submit" onSubmit={login}>
                    <label htmlFor="username">username</label>
                    <input type="text" name="username"/>
                    <label htmlFor="password">password</label>
                    <input type="password" name="password"/>
                    <button type="submit" id="login_button">Log in</button>
                </form>
            </div>
            <div className="orange"></div>
            <svg className="loginSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="var(--orange)" fill-opacity="1" d="M0,128L60,117.3C120,107,240,85,360,112C480,139,600,213,720,250.7C840,288,960,288,1080,245.3C1200,203,1320,117,1380,74.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>        
            <div className="footer">
                <div className="getHelp">
                    <p>Need help?</p>
                </div>
                <div className="logo">
                    <img src="" alt="" />
                </div>
            </div>
            <div className="bottomInformation">
                
            </div>
            
        </div>

    )
}

