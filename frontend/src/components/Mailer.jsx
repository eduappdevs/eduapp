/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../API";

/**
 * Used for sending emails to a user. Dependant on backend.
 */
export const Mailer = (props) => {
  async function sendemail() {
    let email = document.getElementById("email").value;
    let validmail = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
    if (email === "" || email.match(!validmail)) {
      console.log("Please Enter Valid Email");
    } else {
      let http_request_url = `${API_URL}/reset_password?email=${email}`;
      await axios
        .get(http_request_url)
        .then((res) => {
          console.log(res);
          console.log(res.data.status);
          props.showEmailSentModal();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => props.sendEmail && sendemail(), [props.sendEmail]);

  return (
    <>
      <div className="mailer-form">
        <div className="mailer-form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder={props.language.email}
            defaultValue={props.email && props.email}
            required
          />
        </div>
      </div>
    </>
  );
};
