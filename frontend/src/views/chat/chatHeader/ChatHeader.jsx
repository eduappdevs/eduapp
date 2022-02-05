import React from 'react';
import "./ChatHeader.css";

export default function ChatHeader(props) {
	return (
		<div className="ChatHeader">
			<div onClick={() => { console.log("go back"); }} className="ChatHeaderBack">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-caret-left-fill"
					viewBox="0 0 16 16"
				>
					<path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
				</svg>
			</div>
			<div className="ChatHeaderName">
				<img src="http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" alt="Chat Icon" />
				<p>{props.chatName}</p>
			</div>
			<div className="ChatHeaderOptions">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
					<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
				</svg>
			</div>
		</div>
	);
}
