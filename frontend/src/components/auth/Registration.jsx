import React, { Component } from "react";
import axios from "axios";
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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, password_confirmation, user_name } = this.state;
    const userData = new FormData();
    const defaultInfo = new FormData();
    userData.append("user[email]", email);
    userData.append("user[password]", password);

    await API.createUser(userData);
    userData.delete(password_confirmation);
    await await API.login(userData);

    defaultInfo.append("user_id", localStorage.userId);
    defaultInfo.append("user_name", email.split('@')[0]);
    await API.createInfo(defaultInfo);
    window.location.href = "/";
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
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
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
          required
        />
        <label htmlFor="password_confirmation">Repeat password</label>
        <input
          type="password"
          name="password_confirmation"
          value={this.state.password_confirmation}
          onChange={this.handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    );
  }
}
