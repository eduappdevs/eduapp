import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./resources.css";
import ResourcesModal from "../../components/modals/resourcesModal";
import OpenedResource from "./openedResource/openedResource";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import API from "../../API";
import FadeOutLoader from "../../components/loader/FadeOutLoader";
let resources = [];
export default function Resources(props) {
  const [ItsMobileDevice, setItsMobileDevice] = useState(false);
  const [resourcesFilter, setResourcesFilter] = useState("");
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
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
    async function fetchData() {
      const resources__url = "http://localhost:3000/resources";
      await axios.get(resources__url).then((res) => {
        console.log(res);
        res.data.map((x) => {
          if (x.files != null) {
            x.files = x.files.url;
          }
        });
        resources = res.data;
        setTimeout(() => {
          FadeOutLoader();
          setTimeout(() => {
            setResourcesLoaded(true);
          }, 175);
        }, 200);
      });
      console.log("prueba", API.fetchResources());
    }
    fetchData();
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
    document
      .getElementById(`resource__${e.target.id}__opened`)
      .classList.remove("openedResource__hidden");
  };
  const createResource = () => {
    document.getElementsByClassName(
      "resources__createResourceModal"
    )[0].style.display = "flex";
  };

  const handleSearchResources = (e) => {
    setResourcesFilter(e.target.value);
  };

  return resourcesLoaded ? (
    <>
      <div className="resources-main-container">
        <Navbar mobile={ItsMobileDevice} location={"resources"} />
        <section
          className={ItsMobileDevice ? "mobileSection" : "desktopSection"}
        >
          <div className="resourcesSearchBar">
            <form action="">
              <input type="text" onChange={handleSearchResources} />
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
            <div className="resources__addNewResource" onClick={createResource}>
              Add something
            </div>
            {resourcesLoaded ? (
              <ul>
                {resources.map((data) => {
                  if (
                    data.name
                      .toLowerCase()
                      .includes(resourcesFilter.toLowerCase()) ||
                    resourcesFilter === ""
                  ) {
                    return (
                      <>
                        <OpenedResource data={data} />

                        <li
                          id={"res" + data.id}
                          className="resources resourceitem"
                          onClick={openResource}
                        >
                          <div
                            id={"res" + data.id}
                            className="resource-name-container"
                          >
                            <span
                              id={"res" + data.id}
                              className="resource-name"
                            >
                              {data.name}
                            </span>
                          </div>
                          <div className="resourceInfo-container">
                            <div className="resourceInfo__creationDate">
                              <div className="resourceInfo__creationDate__icon">
                                D
                              </div>
                              <div className="resourceInfo__creationDate__content">
                                <div className="resourceInfo__cretionDate_date">
                                  {data.created_at.split("T")[0]}
                                </div>
                                <div className="resourceInfo__cretionDate_time">
                                  {data.created_at.split("T")[1].split(".")[0]}
                                </div>
                              </div>
                            </div>
                            <div className="resourceInfo__createdBy">
                              <div className="resourceInfo__createdBy__icon">
                                T
                              </div>
                              <div className="resourceInfo__createdBy__content">
                                {data.createdBy}
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    );
                  }
                })}
              </ul>
            ) : (
              <div id="RESOURCES_ERROR">
                <br />
                <p>or</p>
                <h3>Refresh the page</h3>
              </div>
            )}
          </div>
        </section>
        <ResourcesModal />

        <BottomButtons mobile={ItsMobileDevice} location={"resources"} />
      </div>
    </>
  ) : (
    <Loader />
  );
}
