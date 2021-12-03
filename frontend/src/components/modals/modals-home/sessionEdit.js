import React from 'react'
import "./SessionModal.css";
import { useState,useEffect } from 'react';
import axios from "axios";

export default function SessionEdit({ idEdit }) {
  const [sessions, setSessions] = useState([]);
    let info = [];
    const data = async() => {
        let e = await axios.get("http://localhost:3000/eduapp_user_sessions/", idEdit);
        let id = e.data.id;
        let name = e.session_name;
        let date = e.session_date;
        let streamingPlatform = e.streaming_platform;
        let resourcesPlatform = e.resources_platform;
        let chat = e.session_chat_id;
        info.push({
            id, name,date,streamingPlatform,resourcesPlatform,chat
        })
        
        console.log(info)
    }
    useEffect(()=>{
        data()
    },[])

    const close = () => {
        idEdit.pop()
        document.getElementsByClassName("ModalSessionEdit__main")[0].classList.add("ModalSession__hidden");
    };
    useEffect(() => {
        try {
            data();
        } catch (error) {
            
        }
    }, [])
    return (
        <>

            <div className={"ModalSessionEdit__main ModalSession__hidden"}>
                <div className="home__addForm" id="home__addFormID">
                    <div className="informationForm">
                        <div className="buttonClose" onClick={close}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                fill="currentColor"
                                class="bi bi-x-circle"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </div>
                        <h1>Edit Session</h1>
                        <form className="addFormContent">
                            <div>
                                <label>Name:</label>
                                <input name="session_name" type="text" placeholder={idEdit}></input>
                            </div>
                            <div className="schedule">
                                <label>Schedule:</label>
                                <div className="timeLabels">
                                    <label htmlFor="start">Start</label>
                                    <label htmlFor="end"> End</label>
                                </div>

                                <div className="timeInputs">
                                    <input name="start" type="time"></input>
                                    <input name="end" type="time"></input>
                                </div>
                            </div>
                            <div>
                                <label>Streaming:</label>
                                <input name="streaming" type="text"></input>
                            </div>
                            <div>
                                <label>Resources:</label>
                                <input name="resources" type="text"></input>
                            </div>
                            <div>
                                <label>Chat:</label>
                                <input name="chat" type="text" defaultValue="hola"></input>
                            </div>
                            <button
                                className="home__buttonSubmit"
                                type="submit"
                                value="Submit"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
