import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbar/navbar';
import ChatHeader from '../chatHeader/ChatHeader';
import DarkModeChanger from "../../../components/DarkModeChanger";
import "./MainChat.css";

export default function MainChat() {
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
		DarkModeChanger(localStorage.getItem('darkMode'));

		if (window.matchMedia("(max-width: 900px)").matches) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	}, []);

	return (
		<>
			<div className="main-chat-container">
				<div id="navbar">
					<Navbar mobile={isMobile} location={"chat"} />
				</div>

				<ChatHeader chatName={"MONICA"} />

				<div className="main-chat-messages-container"></div>
				<div className="main-chat-input-container">
					<div className="main-chat-attachment-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-paperclip" viewBox="0 0 16 16">
							<path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
						</svg>
					</div>
					<div className='main-chat-input-text'>
						<textarea />
					</div>
					<div className="main-chat-send-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="2 -5 15 23">
							<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
						</svg>
					</div>
				</div>
			</div>
		</>
	);
}
