import React, { Component } from "react";
import * as AUTH_SERVICE from "../../services/auth.service";
import logogeduapp from "../../assets/eduappadmin.png";

export default class LoginAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { email, password } = this.state;
      const userData = new FormData();

      userData.append("user[email]", email);
      userData.append("user[password]", password);
      userData.append("device", navigator.userAgent);

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
        <label htmlFor="email">Email</label>
        <input
          data-testid="email"
          type="email"
          name="email"
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
