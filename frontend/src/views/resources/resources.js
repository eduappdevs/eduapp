import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./resources.css";
export default function Resources() {
  const [resources, setResources] = useState([]);
  const [resourceOpened, setResourceOpened] = useState(false);
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const getResources = async () => {
    const response = await fetch("http://localhost:3000/resources");
    const data = await response.json();
    setResources(data);
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
  useEffect(() => {
    getResources();
    checkMediaQueries();
    //First check
    if (window.matchMedia("(max-width: 1100px)").matches) {
      setItsMobileDevice(true);
    } else {
      setItsMobileDevice(false);
    }
  }, []);
  const openResource = (e) => {
    e.preventDefault();
    setResourceOpened(true);
    setTimeout(() => {
      try {
        const resource = document.getElementById(e.target.id);
        const resource_close = document.getElementById("c" + e.target.id);
        const description = document.getElementById(
          "resource-description_" + e.target.id
        );

        resource.style.height = "50vh";
        setTimeout(() => {
          resource.classList.add("resource-opened");
          description.classList.remove("hidden");
          resource_close.classList.remove("hidden");
        }, 200);
        resource.style.cursor = "default";
      } catch (error) {
        console.log(error);
      }
    }, 100);
  };
  const closeResource = (e) => {
    e.preventDefault();
    setResourceOpened(false);
    const id = e.target.id.substring(1);
    try {
      const resource = document.getElementById(id);
      const resource_close = document.getElementById("c" + id);
      const description = document.getElementById("resource-description_" + id);
      resource.style.height = "";
      resource.style.cursor = "pointer";
      resource_close.classList.add("hidden");
      description.classList.add("hidden");
      resource.classList.remove("resource-opened");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="resources-main-container">
        <Navbar mobile={ItsMobileDevice} location={"resources"} />

        <section
          className={ItsMobileDevice ? "mobileSection" : "desktopSection"}
        >
          <div className="resourcesSearchBar">
            <form action="#">
              <input type="text" />
              <div className="searchInputIcon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z"></path>
                </svg>
              </div>
            </form>
          </div>
          <div className="resources-container">
            <ul>
              {resources.map((data) => {
                return (
                  <>
                    <li
                      id={"res" + data.id}
                      className="resources resourceitem"
                      onClick={
                        resourceOpened
                          ? console.log("resourceAlreadyOpened")
                          : openResource
                      }
                    >
                      <div
                        id={"res" + data.id}
                        className="resource-name-container"
                      >
                        <span id={"res" + data.id} className="resource-name">
                          {data.name}
                        </span>
                      </div>

                      <div
                        id={"resource-description_res" + data.id}
                        className="resource-description-container hidden"
                      >
                        <span className=" resource-description">
                          {data.description}
                        </span>
                      </div>
                      <div
                        id={"cres" + data.id}
                        onClick={closeResource}
                        className="close-resource-container hidden"
                      >
                        <div
                          id={"cres" + data.id}
                          className="close-resource "
                        ></div>
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </section>
        <BottomButtons mobile={ItsMobileDevice} location={"resources"} />
      </div>
    </>
  );
}
