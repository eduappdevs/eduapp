import React from "react";
import "./ChatBubble.css";

export default function ChatBubble(props) {
  return (
    <div className={props.foreign ? "foreign-align" : "self-align"}>
      <div className={props.foreign ? "foreign-message" : "self-message"}>
        {props.isGroup && props.foreign ? (
          <p className="show-author">{props.author}</p>
        ) : null}
        <p className={props.isGroup && props.foreign ? "has-author" : null}>
          {props.message}
        </p>
      </div>
    </div>
  );
}
