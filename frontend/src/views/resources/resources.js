import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import "./resources.css";
import BottomButtons  from "../../components/bottomButtons/bottomButtons";
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
      <div className="resources-container">
        <ul>
          {resources.map((data) => {
            return (
              <li>
                <h1>{data.name}</h1>
                <h1>{data.description}</h1>
              </li>
            );
          })}
        </ul>
      </div>
      <BottomButtons/>
    </>
  );
}
