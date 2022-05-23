import React from "react";
import BatcherButtonTemplate from "./BatcherButtonTemplate";
import "./componentStyles/loadUsersCSV.css";

export default function Batcher(props) {
  return <BatcherButtonTemplate type={props.type} />;
}
