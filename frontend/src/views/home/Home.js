import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./home.css";
import SessionAdd from "../../components/modals/modals-home/sessionAdd";
import SessionEdit from "../../components/modals/modals-home/sessionEdit";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { FetchUserInfo } from "../../hooks/FetchUserInfo";
import FadeOutLoader from "../../components/loader/FadeOutLoader";
import { GetCourses } from "../../hooks/GetCourses";
export default function Home() {
  let userInfo = FetchUserInfo(localStorage.userId);
  const idEdit = [];
  const [editFields, setFields] = useState([]);
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [firstSessionId, setFirstSessionId] = useState("");
  let courses;
  courses = GetCourses();
  const sessionsPreSorted = [];
  let sessionsSorted ;

  const openSessionAdd = () => {
    document
      .getElementsByClassName("ModalSessionAdd__main")[0]
      .classList.remove("ModalSession__hidden");
  };
  const openEditSession = async (id) => {
    let e = await axios.get("http://localhost:3000/eduapp_user_sessions/" + id);
    let name = e.data.session_name;
    let date = e.data.session_date;
    let date1 = date.split("-")[0];
    let date2 = date.split("-")[1];
    console.log(date1, date2);
    let streamingPlatform = e.data.streaming_platform;
    let resourcesPlatform = e.data.resources_platform;
    let chat = e.data.session_chat_id;
    setFields({
      id: id,
      session_name: name,
      session_date1: date1,
      session_date2: date2,
      streaming_platform: streamingPlatform,
      resources_platform: resourcesPlatform,
      session_chat_id: chat,
    });
    document
      .getElementsByClassName("ModalSessionEdit__main")[0]
      .classList.remove("ModalSession__hidden");
  };
  const checkMediaQueries = () => {
    setInterval(() => {
      if (window.matchMedia("(max-width: 1100px)").matches) {
        setItsMobileDevice(true);
      } else {
        setItsMobileDevice(false);
      }
    }, 4000);
  };
  const getSessions = async (id) => {
    console.log(id,'entra')
    let request = await axios.get(`http://localhost:3000/eduapp_user_sessions?id=${id}`);
    request.data.map((e) => {
      let id = e.id;
      let name = e.session_name;
      let date = e.session_date;
      let streamingPlatform = e.streaming_platform;
      let resourcesPlatform = e.resources_platform;
      let chat = e.session_chat_id;
      let sorter = date.split("-")[0].split(":")[0] + date.split("-")[0].split(":")[1];
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



    

    console.log(sessionsPreSorted)
    sessionsSorted = sessionsPreSorted.sort(function (a, b) {
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
    setSessions(sessionsSorted);
  };
  const deleteSess = [];
  const deleteModal = (e) => {
    let modal = document.getElementById("modal_question_delete");
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
    let idDelete = e.target.id;
    deleteSess.pop();
    deleteSess.push(idDelete);
  };
  const closeDelete = () => {
    document.getElementById("modal_question_delete").classList.add("hidden");
  };
  const deleteSession = () => {
    axios
      .delete("http://localhost:3000/eduapp_user_sessions/" + deleteSess)
      .then(() => {
        window.location.reload();
      });
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
  const activeEditMenu = () => {
    const buttonSession = Array.from(
      document.querySelectorAll("#editSessionButton")
    );
    const buttonadd = document.getElementById("buttonAdd");
    if (buttonadd.classList.contains("hidden")) {
      buttonadd.classList.remove("hidden");
    }
    buttonSession.map((x) => {
      try {
        if (x.classList.contains("hidden")) {
          x.classList.remove("hidden");
        } else {
          x.classList.add("hidden");
          buttonadd.classList.add("hidden");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    try {
    } catch (error) {
      console.log(error);
    }
    checkMediaQueries();
<<<<<<< Updated upstream

    if (window.matchMedia("(max-width: 1100px)").matches) {
=======
    DarkModeChanger(localStorage.getItem('darkMode'))
    if (window.matchMedia("(max-width: 900px)").matches) {
>>>>>>> Stashed changes
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);
  return courses ? (
    <>
      {
       courses.map((c)=>{
       getSessions(c.id)
})
      }
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
                    src={
                      userInfo.profile_image != null
                        ? userInfo.profile_image.url
                        : "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                    }
                    alt={(userInfo.user_name, "image")}
                  />
                </div>
                <div className="user-name">
                  <h1>{userInfo.user_name}</h1>
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
              <div className="home__Add hidden" id="buttonAdd">
                <div className="home__buttonadd">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-plus-circle-fill"
                    viewBox="0 0 16 16"
                    onClick={() => {
                      openSessionAdd();
                    }}
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
                                <p className="session_chat_id">{data.chat}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="editSessionButton"
                          className="editSessionButton hidden"
                        >
                          <div id="buttonDelete">
                            <svg
                              className="badge badge-danger mr-2"
                              onClick={deleteModal}
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
                          <div className="buttonsessionedit" id="buttonEdit">
                            <svg
                              onClick={() => {
                                openEditSession(data.id);
                              }}
                              id={"edit" + data.id}
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                            >
                              <path d="M1.438 16.872l-1.438 7.128 7.127-1.438 12.642-12.64-5.69-5.69-12.641 12.64zm2.271 2.253l-.85-.849 11.141-11.125.849.849-11.14 11.125zm20.291-13.436l-2.817 2.819-5.69-5.691 2.816-2.817 5.691 5.689z" />
                            </svg>
                          </div>
                          <div
                            id="modal_question_delete"
                            className="modal_question_delete hidden"
                          >
                            <div className="question_delete">
                              <p>¿Seguro que quieres eliminarlo?</p>
                              <div className="button">
                                <button
                                  className="buttonYes"
                                  onClick={deleteSession}
                                >
                                  Si
                                </button>
                                <button
                                  className="buttonYes"
                                  onClick={closeDelete}
                                >
                                  No
                                </button>
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
              ) : (
                <h1>You have no sessions left</h1>
              )}
            </div>
          </div>
        </section>
        <SessionEdit fields={editFields} />
        <SessionAdd />
        <BottomButtons mobile={ItsMobileDevice} location={"home"} />
      </div>
    </>
  ) : (
    <Loader />
  );
}
