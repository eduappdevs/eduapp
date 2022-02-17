import React from 'react';
import { GoogleLogin } from 'react-google-login';
import LoginAuth from "../../components/auth/LoginAuth";
import "./Login.css";

export default function Login() {

	const responseGoogle = (response) => {
		console.log(response);
	}


	return (
		<div className="accessPageSection">
			<div className="accessPage-logo">
				<img src="\assets\logo.png" alt="" />
			</div>
			<div className="loginContainer">
				<div className="loginDiv">
					<LoginAuth />
				</div>
				<div className="googleButton">
					<GoogleLogin
						clientId="34244826007-ute01mc8d42e8hc89bgsiv73njfj9kbe.apps.googleusercontent.com"
						buttonText="Login"
						onSuccess={responseGoogle}
						onFailure={responseGoogle}
						cookiePolicy={'single_host_origin'}
					/>
				</div>

			</div>
			<svg
				className="accessPageSvg"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1440 320"
			>
				<path
					fill="var(--blue)"
					fill-opacity="1"
					d="M0,224L80,197.3C160,171,320,117,480,128C640,139,800,213,960,240C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
				></path>
			</svg>
			<div className="blue"></div>
			<div className="accessPage_background"></div>
		</div>
	);
}
