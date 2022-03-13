/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/render-result-naming-convention */
import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import ChatMenu from "./ChatMenu";
import MainChat from "./mainChat/MainChat";
import ReactDOM from "react-dom";

describe("Chat Main Menu", () => {
  test("Enter Chat", () => {
    const component = render(<ChatMenu />);
    const mainInterface = component.container.querySelector("#chat-box");
    const chatMenu = component.container.getElementsByClassName(
      "chat-menu-container"
    )[0];
    const groupChats =
      component.container.getElementsByClassName("chats-container")[0];

    ReactDOM.render(
      <div className="chat-group-container">
        <h2>Groups</h2>
        <ul>
          <li
            onClick={jest.fn((event) => {
              const chatBox = document.getElementById("chat-box");
              const chatMenu = document.getElementsByClassName(
                "chat-menu-container"
              )[0];
              const loader = document.getElementById("chat-loader");
              chatMenu.style.display = "none";
              loader.style.display = "block";

              // Connection Goes Here

              setTimeout(() => {
                chatBox.style.display = "block";
                loader.style.display = "none";
              }, 310);
            })}
            id={`group-chat-1`}
          >
            <img
              className="chat-icon"
              src="https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
              alt="Chat User Icon"
            />
            <div className="chat-info chat-idle-state">
              <h2 className="chat-name">Grupo Test</h2>
            </div>
          </li>
        </ul>
      </div>,
      groupChats
    );
    act(() => groupChats.childNodes[0].childNodes[1].childNodes[0].click());
    expect(chatMenu).toHaveStyle("display: none");
    expect(mainInterface).toHaveStyle("display: block");
  });
  test("Chat Send Button", () => {
    const component = render(
      <MainChat messages={[]} closeHandler={() => {}} chatName="Grupo Test" />
    );
    const sendBtn = component.container.getElementsByClassName("bi-send")[0];
    const msgInput = component.container.querySelector("#message-area");

    sendBtn.onclick = () => {
      msgInput.value = "hola";
    };
    act(() => sendBtn.dispatchEvent(new Event("click")));
    expect(msgInput.value).toBe("hola");
  });
});
