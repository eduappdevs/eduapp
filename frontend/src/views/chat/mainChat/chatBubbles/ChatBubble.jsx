import React from 'react';
import "./ChatBubble.css";

export default function ChatBubble(props) {
	return (
		<div className={props.foreign ? "foreign-align" : "self-align"}>
			<div className={props.foreign ? "foreign-message" : "self-message"}>
				<p>{props.message}</p>
			</div>
		</div>
	);
}
