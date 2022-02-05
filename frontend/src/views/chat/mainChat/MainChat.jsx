import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/navbar/navbar';
import ChatHeader from '../chatHeader/ChatHeader';
import DarkModeChanger from "../../../components/DarkModeChanger";
import BottomButtons from "../../../components/bottomButtons/bottomButtons";
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
				<div className="main-chat-input-container"></div>
				{/* <BottomButtons mobile={isMobile} location={"chat"} /> */}
			</div>
		</>
	);
}
