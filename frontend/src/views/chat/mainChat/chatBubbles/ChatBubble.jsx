/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./ChatBubble.css";

export default function ChatBubble(props) {
  const ref = useRef(null);
  const [msgMargin, setMsgMargin] = useState(0);
  const [marginType, setMarginType] = useState({});

  useEffect(() => {
    setMsgMargin(window.innerWidth - 50 - ref.current.offsetWidth);
    setMarginType(
      props.foreign
        ? {
            marginRight: msgMargin,
          }
        : {
            marginLeft: msgMargin,
          }
    );
  }, [props.foreign, msgMargin, props.isMsgRecent, window.innerWidth]);

  return (
    <div className={props.foreign ? "foreign-align" : "self-align"}>
      <div
        ref={ref}
        className={props.foreign ? "foreign-message" : "self-message"}
        style={marginType}
      >
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
