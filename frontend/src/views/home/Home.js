import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./home.css";

export default function Home() {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [firstSessionId, setFirstSessionId] = useState("");
  let firstSession = [];
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
    const session = [
      {
        id: "0",
        name: "SSG",
        date: "8:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "1",
        name: "DAD",
        date: "17:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "2",
        name: "DAM",
        date: "8:10",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "3",
        name: "DAM",
        date: "10:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "4",
        name: "DAM",
        date: "11:00",
        streamingPlatform: "Teams",
        resourcesPlatform: "Moddle",
      },
      {
        id: "5",
        name: "DAM",
        date: "12:00",
        streamingPlatform: "Meet",
        resourcesPlatform: "Eduapp",
      },
    ];
    const sessionSorted = [];
    const data =Array.from(await session);
    data.map((e) => {
      let currentDate = e.date.split(":")
      let currentHour = parseInt(currentDate[0]);
      let currentMin = parseInt(currentDate[1]);
      let firstSessionHour = parseInt(firstSession[0]);
      let firstSessionMin = parseInt(firstSession[1]);
      if (firstSession.length == 0) {
        firstSession = currentDate;
        setFirstSessionId(e.id);
      } else {
        if (currentHour < firstSessionHour) {
          firstSession = currentDate;


        } else if (firstSessionHour == currentHour) {
          if (firstSessionMin < currentMin) {
            firstSession = currentDate;
          }
        }
      }
    })
    while (data.length > 0) {
      console.log(data)
      let lower = [];
      let lowerObj;
      data.map((e) =>{
        let currentDate = e.date.split(":")
        let currentHour = parseInt(currentDate[0]);
        let currentMin = parseInt(currentDate[1]);
        let lowerHour = parseInt(lower[0]);
        let lowerMin = parseInt(lower[1]);
        if (lower.length == 0) {
          lower = currentDate;
          console.log("PRIMERO",lower);
          lowerObj = e;
        } else {
          
          if (currentHour <= lowerHour) {
            console.log("eee",lowerHour,currentHour);
            if(currentMin<=lowerMin){
              lower = currentDate;
              lowerObj = e;
              console.log('ee',e)
            }

          }
        }

      })   
      sessionSorted.push(lowerObj)   
      data.splice(lowerObj)
      lower = [];
      lowerObj = {};
      console.log("eeeeeeeeeeee",...data)


    }
    setSessions(sessionSorted);
    console.log(sessionSorted)


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
                    src="https://img-aws.ehowcdn.com/600x400/photos.demandstudios.com/getty/article/34/162/91911271.jpg?type=webp"
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
                {sessions.map((data) => {


                  return (
                    <>
                      <div
                        className={firstSessionId === data.id ? "home__firstSession sessions-container" : "sessions-container"}
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
