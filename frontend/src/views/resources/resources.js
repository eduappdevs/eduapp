import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./resources.css";
export default function Resources() {
  const [resources, setResources] = useState([]);
  const [resourceOpened, setResourceOpened] = useState(false);
  const [currentResource, setCurrentResource] = useState("");
  const getResources = async () => {
    const response = await fetch("http://localhost:3000/resources");
    const data = await response.json();
    setResources(data);
  };
  useEffect(() => {
    getResources();
  }, []);
  const openResource = (e) => {
    e.preventDefault();
    setResourceOpened(true);
    setTimeout(() => {
      try {
        const id = e.target.id;
        setCurrentResource(id);
        const resource = document.getElementById(id);
        const resource_close = document.getElementById("close-resource_" + id);
        const description = document.getElementById(
          "resource-description_" + id
        );
        resource.classList.remove("resources-closed");
        resource.classList.add("resources-opened");
        resource_close.classList.remove("hidden");
        description.classList.remove("hidden");
      } catch (error) {
        console.log(error);
      }
    }, 100);
  };
  const closeResource = (e) => {
    e.preventDefault();
    setResourceOpened(false);
    try {
      const resource = document.getElementById(currentResource);
      const resource_close = document.getElementById(
        "close-resource_" + currentResource
      );
      const name = document.getElementById(
        "resource-name_" + setCurrentResource
      );
      const description = document.getElementById(
        "resource-description_" + currentResource
      );
      resource.style.opacity = "0";
      setTimeout(() => {
        setTimeout(() => {
          resource.style.transform = "scale(0)";
        });
        resource.classList.add("resources-closed");
        resource.classList.remove("resources-opened");
        resource_close.classList.add("hidden");
        description.classList.add("hidden");
        setTimeout(() => {
          resource.style.opacity = "1";
          setTimeout(() => {
            resource.style.transform = "scale(1)";
          }, 50);
        }, 200);
      }, 400);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
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
                  className="resources-closed resourceitem"
                  onClick={
                    resourceOpened
                      ? console.log("resourceAlreadyOpened")
                      : openResource
                  }
                >
                  <div
                    id={"close-resource_res" + data.id}
                    className="close-resource hidden"
                    onClick={closeResource}
                  ></div>
                  <span
                    id={"resource-name_res" + data.id}
                    className="resource-name"
                  >
                    {data.name}
                  </span>
                  <span
                    id={"resource-description_res" + data.id}
                    className="hidden resource-description"
                  >
                    {data.name}
                  </span>
                </li>
              </>
            );
          })}
        </ul>
      </div>
      <BottomButtons location={"resources"} />
    </>
  );
}
