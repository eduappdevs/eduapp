import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./home.css";

export default function Home() {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionOpened, setSessionOpened] = useState(false);
  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.matchMedia("(max-width: 1000px)").matches) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 4000);
  };
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
  const openSession = (e) =>{
    e.preventDefault();
    setSessionOpened(true);
    setTimeout(() => {
      try {
        
      } catch (error) {
        console.log(error);
      }
    }, 100);
  }
  useEffect(() => {
    getSessions();
    checkMediaQueries();
    if (window.matchMedia("(max-width: 1000px)").matches) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="user">
        <div className="user-container">
          <div className="information-user">
            <div className="profile-picture">
              <img
                src="https://img-aws.ehowcdn.com/600x400/photos.demandstudios.com/getty/article/34/162/91911271.jpg?type=webp"
                alt=""
              />
            </div>
            <div className="user-name">
              <h1>Richard Clarke</h1>
              <div className="edit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                >
                  <path d="M1.438 16.872l-1.438 7.128 7.127-1.438 12.642-12.64-5.69-5.69-12.641 12.64zm2.271 2.253l-.85-.849 11.141-11.125.849.849-11.14 11.125zm20.291-13.436l-2.817 2.819-5.69-5.691 2.816-2.817 5.691 5.689z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="sessions">
            {sessions.map((data) => {
              return (
                <>
                  <div className="sessions-container" id={"ses"+data.id}>
                    <div className="sessions-closed ">
                      <div className="session-before">
          
                      <div id={"ses"+data.id} className="arrow" onClick={openSession}>
                      <svg xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                      </svg>
                      </div>
                        <span className="session-name">{data.name}</span>
                        <span className="session-date">{data.date}</span>
                      </div>
                      <div  className="sessions-after hidden">
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
                  </div>
                </>
              );
            })}
            {/* </div>
            </div> */}
          </div>
        </div>
      </div>
      <BottomButtons mobile={ItsMobileDevice} location={"home"} />
    </>
  );
}
