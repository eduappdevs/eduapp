import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./home.css";

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const getSessions = async () => {
    const session = [
      {
        id: "0",
        name: "SSG",
        date: "8:00-9:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "1",
        name: "DAD",
        date: "8:00-9:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "2",
        name: "DAM",
        date: "8:00-9:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
    ];
    const data = await session;
    setSessions(data);
  };
  useEffect(() => {
    getSessions();
  }, []);
  return (
    <>
      <Navbar />
      <div className="user">
        <div className="information-user">
          <div className="profile-picture">
            <img
              src="https://img-aws.ehowcdn.com/600x400/photos.demandstudios.com/getty/article/34/162/91911271.jpg?type=webp"
              alt=""
            />
          </div>
          <div className="user-name">
            <h1>Pepe</h1>
            <div className="edit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </div>
          </div>
          <div className="sessions">
            {/* <div className="title-first-session">
              <p>Next Session</p>
            </div>
            <div className="sessions-item">
              <div className="button-information">
                <svg xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              </div> */}
            {sessions.map((data) => {
              return (
                <>
                  <div className="sessions-container">
                    <div id={data.id} className="sessions-closed hidden">
                      <svg xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>

                      <span className="session-name">{data.name}</span>
                      <span className="session-date">{data.date}</span>
                    </div>
                    <div className="sessions-openned ">
                      <svg xmlns="http://www.w3.org/2000/svg">
                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                      </svg>
                      <span className="session-name">{data.name}</span>
                      <span className="session-date">{data.date}</span>
                      <div className="session-description">
                        <p className="session-streamingPlatform">
                          {data.streamingPlatform}
                        </p>
                        <p className="session-resourcesPlatform">
                          {data.resourcesPlatform}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            {/* </div>
            </div> */}
          </div>
        </div>
      </div>
      <BottomButtons location={"home"} />
    </>
  );
}
