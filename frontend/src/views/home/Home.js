import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./home.css";
import axios from "axios";

export default function Home() {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [firstSessionId, setFirstSessionId] = useState("");
  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 4000);
  };
  const getSessions = async () => {
    let request = await axios.get("http://localhost:3000/eduapp_user_sessions");
    const sessionsPreSorted = [];
    request.data.map((e) => {
      let id = e.id;
      let name = e.session_name;
      let date = e.session_date;
      let streamingPlatform = e.streaming_platform;
      let resourcesPlatform = e.resources_platform;
      let chat = e.session_chat_id;
      let sorter =
        date.split("-")[0].split(":")[0] + date.split("-")[0].split(":")[1];
      sessionsPreSorted.push({
        id,
        name,
        date,
        streamingPlatform,
        resourcesPlatform,
        chat,
        sorter,
      });
    });

    const sessionSorted = sessionsPreSorted.sort(function (a, b) {
      var a = parseInt(a.sorter);
      var b = parseInt(b.sorter);
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    setSessions(sessionSorted);
    setFirstSessionId(sessionSorted[0].id);
  };
  const openSession = (e) => {
    e.preventDefault();
    const after = document.getElementById(
      "session-after" + e.target.id.substring(3)
    );
    const img = document.getElementById("button" + e.target.id.substring(3));
    setTimeout(() => {
      try {
        // const session = document.querySelector(e.target.id);
        if (after.classList.contains("hidden")) {
          after.classList.remove("hidden");
          img.classList.add("rotate");
        } else {
          after.classList.add("hidden");
          img.classList.remove("rotate");
        }
      } catch (error) {
        console.log(error);
      }
    }, 100);
  };
  useEffect(() => {
    getSessions();
    checkMediaQueries();
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);
  return (
    <>
      <div className="home-main-container">
        <Navbar mobile={ItsMobileDevice} location={"home"} />
        <section
          className={ItsMobileDevice ? "mobileSection" : "desktopSection"}
        >
          <div className="user">
            <div className="user-container">
              <div className="information-user">
                <div className="profile-picture">
                  <img
                    src="https://media-exp1.licdn.com/dms/image/C4D35AQEKTcP6XIR5cg/profile-framedphoto-shrink_200_200/0/1619629145557?e=1638417600&v=beta&t=NZ2vQCV1ePHoVdHbzwwej__qaNH2_UQ1wVP7rmevsnk"
                    alt=""
                  />
                </div>
                <div className="user-name">
                  <h1>Richard Clarke</h1>
                  {/* <div className="edit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1.438 16.872l-1.438 7.128 7.127-1.438 12.642-12.64-5.69-5.69-12.641 12.64zm2.271 2.253l-.85-.849 11.141-11.125.849.849-11.14 11.125zm20.291-13.436l-2.817 2.819-5.69-5.691 2.816-2.817 5.691 5.689z" />
                    </svg>
                  </div> */}
                </div>
              </div>
              <div className="sessions">
                <p id="home__nextSession">Next session</p>
                {sessions.map((data) => {
                  return (
                    <>
                      <div
                        className={
                          firstSessionId === data.id
                            ? "home__firstSession sessions-container"
                            : "sessions-container"
                        }
                        onClick={openSession}
                        id={"ses" + data.id}
                      >
                        <div className="sessions-closed" id={"ses" + data.id}>
                          <div className="session-before">
                            <div id={"button" + data.id} className="arrow">
                              <svg xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                              </svg>
                            </div>
                            <span className="session-name">{data.name}</span>
                            <span className="session-date">{data.date}</span>
                          </div>
                          <div
                            id={"session-after" + data.id}
                            className="sessions-after hidden"
                          >
                            <div className="session-platforms">
                              <p className="session-streamingPlatform">
                                {data.streamingPlatform}
                              </p>
                              <p className="session-resourcesPlatform">
                                {data.resourcesPlatform}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p
                        className={
                          firstSessionId === data.id ? console.log : "hidden"
                        }
                      >
                        Sessions
                      </p>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <BottomButtons mobile={ItsMobileDevice} location={"home"} />
      </div>
    </>
  );
}
