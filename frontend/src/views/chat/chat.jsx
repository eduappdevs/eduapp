import React, { useState, useEffect } from 'react';
import Navbar from "../../components/navbar/navbar";
import DarkModeChanger from "../../components/DarkModeChanger";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./chat.css";

export default function Chat() {
	const [isMobile, setIsMobile] = useState(false);

	const checkMediaQueries = () => {
		setInterval(() => {
			if (window.matchMedia("(max-width: 1100px)").matches) {
				setIsMobile(true);
			} else {
				setIsMobile(false);
			}
		}, 4000);
	};

	useEffect(() => {
		checkMediaQueries();
		DarkModeChanger(localStorage.getItem('darkMode'))

		if (window.matchMedia("(max-width: 900px)").matches) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	}, []);

	return (
		<>
			<div className="chat-main-container">
				<Navbar mobile={isMobile} location={"chat"} />

				<div className="chat-search-container">
					<form action="">
						<input type="text" onChange={console.log("typing new search")} />
						<div className="chat-search-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								x="0px"
								y="0px"
								width="32"
								height="32"
								viewBox="0 0 32 32"
							>
								<path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z"></path>
							</svg>
						</div>
					</form>
				</div>

				<div className="chats-container">
					<div className="chat-group-container">
						<h2>Groups</h2>
						<ul>
							<li>
								<img className="chat-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<div className="chat-info chat-writing-state">
									<h2 className="chat-name">Eduapp Team</h2>
									<p className="chat-writing">Equisde is writing...</p>
								</div>
								<p className="chat-pending-messages"><span>20</span></p>
							</li>
							<li>
								<img className="chat-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<div className="chat-info chat-idle-state ">
									<h2 className="chat-name">ROW Team</h2>
									<p className="chat-message-state">Cris is writing...</p>
								</div>
								<p className="chat-pending-messages"><span>15</span></p>
							</li>
						</ul>
					</div>
					<div className="chat-user-container">
						<h2>Users</h2>
						<ul>
							<li>
								<img className="chat-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<div className="chat-info chat-writing-state">
									<h2 className="chat-name">Felix</h2>
									<p className="chat-writing">Writing...</p>
								</div>
								<p className="chat-pending-messages"><span>20</span></p>
							</li>
							<li>
								<img className="chat-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<div className="chat-info chat-idle-state ">
									<h2 className="chat-name">Adri</h2>
								</div>
								<p className="chat-pending-messages"><span>15</span></p>
							</li>
						</ul>
					</div>
				</div>
				<BottomButtons mobile={isMobile} location={"chat"} />
			</div>
		</>
	);
}
