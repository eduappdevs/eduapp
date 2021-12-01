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

    try {
      setFirstSessionId(sessionSorted[0].id);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteSession = (e) => {
    let sort = e.target.id;
    axios.delete("http://localhost:3000/eduapp_user_sessions/" + sort).then();
  };
  const openSession = (e) => {
    e.preventDefault();
    console.log("open");
    const after = document.getElementById(
      "session-after" + e.target.id.substring(3)
    );
    const img = document.getElementById("button" + e.target.id.substring(3));
    console.log(after);
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
  const activeModalAdd = (e) => {
    e.preventDefault();
    const addFormMobile = document.getElementById("home__addFormIDMobile");
    const addFormPC = document.getElementById("home__addFormIDPC");

    const pc = document.getElementById("pcForm");
    const mobile = document.getElementById("mobileForm");
    try {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        console.log(mobile)
        pc.classList.add("hidden");
        mobile.classList.remove("hidden")
        if (addFormMobile.classList.contains("hidden")) {
          addFormMobile.classList.remove("hidden");
          addFormPC.classList.add("hidden");
        }else{
          addFormPC.classList.remove("hidden");
          addFormMobile.classList.add("hidden");
        }
      } else {
        mobile.classList.add("hidden");
        pc.classList.remove("hidden")
        if (addFormPC.classList.contains("hidden")) {
          addFormPC.classList.remove("hidden");
          addFormMobile.classList.add("hidden");
        }else{
          addFormMobile.classList.remove("hidden");
          addFormPC.classList.add("hidden");
        }
      }
    } catch (error) {
      console.log(e);
    }
  };
  const activeEditMenu = (e) => {
    e.preventDefault();
    const buttonDelete = document.getElementById("buttonDelete");
    const buttonadd = document.getElementById("buttonAdd");
    const buttonedit = document.getElementById("buttonEdit");
    try {
      if (buttonadd.classList.contains("hidden")) {
        buttonDelete.classList.remove("hidden");
        buttonadd.classList.remove("hidden");
        buttonedit.classList.remove("hidden");
      } else {
        buttonDelete.classList.add("hidden");
        buttonadd.classList.add("hidden");
        buttonedit.classList.add("hidden");
      }
    } catch (error) {
      console.log(e);
    }
  };
  const hiddenModel = (e) =>{
    console.log("hola")
    e.preventDefault();
    const addForm = document.getElementById("home__addFormID");
    try {
        if (addForm.classList.contains("hidden")) {
          addForm.classList.remove("hidden");
        }else{
          addForm.classList.add("hidden");

        }
      }catch (error) {
      console.log(e);
    }
  
  
  }

  useEffect(() => {
    try {
      getSessions();
    } catch (error) {
      console.log(error);
    }
    const pc = document.getElementById("pcForm");
    const mobile = document.getElementById("mobileForm");
    checkMediaQueries();
    if (window.matchMedia("(max-width: 1100px)").matches) {
      pc.classList.remove("hidden");
      mobile.classList.add("hidden")
      setItsMobileDevice(true);
    } else {
      pc.classList.add("hidden");
      mobile.classList.remove("hidden")
      setItsMobileDevice(false);
    }
  }, []);
  return (
    <>
      <div id="pcForm">
        <div className="home__addForm hidden" id="home__addFormIDPc">
          <div className="informationForm" >
            <div className="buttonClose">
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
            <h1>Add Session</h1>
            <form className="addFormContent">
              <div>
                <label>Name:</label>
                <input type="text"></input>
              </div>
              <div>
                <label>date:</label>
                <input type="text"></input>
              </div>
              <div>
                <label>Streaming:</label>
                <input type="text"></input>
              </div>
              <div>
                <label>Resources:</label>
                <input type="text"></input>
              </div>
              <div>
                <label>Chat:</label>
                <input type="text"></input>
              </div>
              <button className="home__buttonSubmit" type="submit" value="Submit">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="home-main-container">
        <Navbar mobile={ItsMobileDevice} location={"home"} />
        <section
          className={ItsMobileDevice ? "mobileSection" : "desktopSection"}
        >
          <div className="user">
            <div id="mobileForm">
            <div className="home__addForm hidden" id="home__addFormIDMobile">
              <div className="informationForm">
                <div className="buttonClose" onClick={hiddenModel}>
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
                <h1>Add Session</h1>
                <form className="addFormContent">
                  <div>
                    <label>Name:</label>
                    <input type="text"></input>
                  </div>
                  <div>
                    <label>date:</label>
                    <input type="text"></input>
                  </div>
                  <div>
                    <label>Streaming:</label>
                    <input type="text"></input>
                  </div>
                  <div>
                    <label>Resources:</label>
                    <input type="text"></input>
                  </div>
                  <div>
                    <label>Chat:</label>
                    <input type="text"></input>
                  </div>
                  <button className="home__buttonSubmit" type="submit" value="Submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
            </div>

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
                  <div className="edit" onClick={activeEditMenu}>
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
              <div className="home__Add" id="buttonAdd">
                <div className="home__buttonadd">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    onClick={activeModalAdd}
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                </div>
              </div>
              {sessions.length > 0 ? (
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
                        <div id="buttonDelete" className="hidden">
                          <svg
                            className="badge badge-danger mr-2"
                            onClick={deleteSession}
                            id={data.id}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fill-rule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </div>
                        <div
                          className="buttonsessionedit hidden"
                          id="buttonEdit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1.438 16.872l-1.438 7.128 7.127-1.438 12.642-12.64-5.69-5.69-12.641 12.64zm2.271 2.253l-.85-.849 11.141-11.125.849.849-11.14 11.125zm20.291-13.436l-2.817 2.819-5.69-5.691 2.816-2.817 5.691 5.689z" />
                          </svg>
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
              ) : (
                <h1>An error ocurred</h1>
              )}
            </div>
          </div>
        </section>
        <BottomButtons mobile={ItsMobileDevice} location={"home"} />
      </div>
    </>
  );
}
