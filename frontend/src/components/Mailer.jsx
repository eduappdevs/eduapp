import React, { useEffect } from "react";
import axios from "axios";

export const Mailer = (props) => {
  async function sendemail() {
    let email;
    let validmail = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
    if (email === "" || email.match(!validmail)) {
      console.log("Please Enter Valid Email");
    } else {
      let http_request_url = `http://localhost:3000/reset_password?email=${email}`;
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

  useEffect(() => {
    props.sendEmail && sendemail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sendEmail]);

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
          />
        </div>
      </div>
    </>
  );
};
