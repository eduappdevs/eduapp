import React, { useState, useEffect } from 'react';
import Navbar from "../../components/navbar/navbar";
import DarkModeChanger from "../../components/DarkModeChanger";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./chat.css";

export default function Chat() {
	const [isMobile, setIsMobile] = useState(false)

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
				<div className="chat-search-container"></div>

				<div className="chats-container">
					<div className="chat-group-container">
						<h2>Groups</h2>
						<ul>
							<li>
								<img className="chat-group-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<div className="chat-group-info">
									<h2 className="chat-group-name">Eduapp Team</h2>
									<p className="chat-group-message-state">Monica is writing...</p>
								</div>
								<span className="chat-group-pending-messages">20</span>
							</li>
							<li>
								<img className="chat-group-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<div className="chat-group-info">
									<h2 className="chat-group-name">ROW Team</h2>
									<p className="chat-group-message-state">Cris is writing...</p>
								</div>
								<span className="chat-group-pending-messages">15</span>
							</li>
						</ul>
					</div>
					<div className="chat-user-container">
						<h2>Users</h2>
						<ul>
							<li>
								<img className="chat-user-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<h2 className="chat-user-name">Monica<span className="chat-user-pending-messages">1</span></h2>
							</li>
							<li>
								<img className="chat-user-icon" src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat User Icon" />
								<h2 className="chat-user-name">Rosa<span className="chat-user-pending-messages">7</span></h2>
							</li>
						</ul>
					</div>
				</div>
				<BottomButtons mobile={isMobile} location={"chat"} />
			</div>
		</>
	);
}
