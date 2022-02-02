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
					<div className="chat-group-container"></div>
					<div className="chat-user-container"></div>
				</div>
				<BottomButtons mobile={isMobile} location={"chat"} />
			</div>
		</>
	);
}
