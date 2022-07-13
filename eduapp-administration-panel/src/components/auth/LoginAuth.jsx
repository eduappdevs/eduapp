import React, { Component } from "react";
import * as AUTH_SERVICE from "../../services/auth.service";
import logogeduapp from "../../assets/eduappadmin.png";

export default class LoginAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { login, password } = this.state;
      const userData = new FormData();

      userData.append("user[login]", login);
      userData.append("user[password]", password);

      await AUTH_SERVICE.login(userData);
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <form className="login_form" onSubmit={this.handleSubmit}>
        <h1>LOG IN</h1>
        <label htmlFor="login">Email or username</label>
        <input
          data-testid="login"
          type="text"
          name="login"
          onChange={this.handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          data-testid="password"
          type="password"
          name="password"
          onChange={this.handleChange}
          required
        />
        <button data-testid="loginButton" type="submit">
          Login
        </button>
        <img src={logogeduapp} alt="eduapplogo" />
      </form>
    );
  }
}
