import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import BottomButtons from "../../components/bottomButtons/bottomButtons";
import "./resources.css";
export default function Resources() {
  const [resources, setResources] = useState([]);
  const getResources = async () => {
    const response = await fetch("http://localhost:3000/resources");
    const data = await response.json();
    console.log(data);
    setResources(data);
  };

  useEffect(() => {
    getResources();
  }, []);
  return (
    <>
      <Navbar />
      <div className="resourcesSearchBar">
        <form action="#">
          <input type="text" />
          <button type="submit">
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
          </button>
        </form>
      </div>
      <div className="resources-container">
        <ul>
          {resources.map((data) => {
            return (
              <li>
                <div className="resources-information">
                  <span id="resource-name">{data.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <BottomButtons/>
    </>
  );
}
