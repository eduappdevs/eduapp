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
								<div>
									<img />
									<div className="chat-group-info">
										<h2>Group 1</h2>
										<p>Monica is writing...</p>
									</div>
									<div className="chat-group-pending-messages">20</div>
								</div>
							</li>
						</ul>
					</div>
					<div className="chat-user-container">
						<h2>Users</h2>
						<ul>
							<li>User 1</li>
						</ul>
					</div>
				</div>
				<BottomButtons mobile={isMobile} location={"chat"} />
			</div>
		</>
	);
}
