import React from "react";
import BatcherButtonTemplate from "./BatcherButtonTemplate";
import "./componentStyles/loadUsersCSV.css";

/**
 * Template used for batch loading.
 *
 * @param {String} type Type of batcher to use.
 * @returns
 */
export default function Batcher(props) {
  return <BatcherButtonTemplate type={props.type} />;
}
