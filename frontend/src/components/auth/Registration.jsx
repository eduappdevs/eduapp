import React, { Component } from "react";
import API from "../../API";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password_confirmation: "",
      registrationErrors: "",
      user_name: "",
      passwordEmpty: true,
      passwordMatches: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkPasswordMatch = this.checkPasswordMatch.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const userData = new FormData();
    const defaultInfo = new FormData();
    userData.append("user[email]", email);
    userData.append("user[password]", password);
    await API.createUser(userData);
    await await API.login(userData)
      .then((res) => {
        console.log(res);
        defaultInfo.append("user_id", localStorage.userId);
        defaultInfo.append("user_name", email.split("@")[0]);
        API.createInfo(defaultInfo);
      })
      .catch((err) => {
        console.log(err, "an error ocurred");
      });

    window.location.href = "/";
  };
  handleChange = async (event) => {
    await this.setState({
      [event.target.name]: event.target.value,
    });
    this.checkPasswordMatch();
  };

  checkPasswordMatch = () => {
    //Check first password field is not empty
    if (this.state.password.length > 0) {
      this.setState({
        passwordEmpty: false,
      });
      if (this.state.password === this.state.password_confirmation) {
        this.setState({
          passwordMatches: true,
        });
        document
          .getElementById("registration__submit")
          .removeAttribute("disabled");
      } else {
        this.setState({
          passwordMatches: false,
        });
        document
          .getElementById("registration__submit")
          .setAttribute("disabled", true);
      }
    } else {
      this.setState({
        passwordEmpty: true,
      });
    }
    //Check if password_confirmation matches
  };

  render() {
    return (
      <form className="registration_form" onSubmit={this.handleSubmit}>
        <h1>SIGN UP</h1>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <div className="password__wrapper">
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
          <div
            className={
              this.state.passwordEmpty
                ? "matchPasswordIcon passwordMismatch"
                : "matchPasswordIcon passwordMatch"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-check-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
          </div>
        </div>

        <label htmlFor="password_confirmation">Repeat password</label>
        <div className="password__wrapper">
          <input
            type="password"
            name="password_confirmation"
            className="password_confirmation"
            value={this.state.password_confirmation}
            onChange={this.handleChange}
            required
          />
          <div
            className={
              this.state.passwordMatches
                ? "matchPasswordIcon passwordMatch"
                : "matchPasswordIcon passwordMismatch"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-check-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
          </div>
        </div>

        <button
          id="registration__submit"
          className={this.state.passwordMatches ? "enabled" : "disabled"}
          type="submit"
          disabled
        >
          Register
        </button>
      </form>
    );
  }
}
