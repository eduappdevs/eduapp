import React, { Component } from "react";
import API from "../../API";

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

  handleSubmit = (event) => {
    event.preventDefault();

    try {
      const { email, password } = this.state;
      const userData = new FormData();

      userData.append("user[email]", email);
      userData.append("user[password]", password);

      API.login(userData).then((res) => {
        console.log(res);
        window.location.href = "/";
      });
    } catch (error) {
      console.log("error");
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
          type="email"
          name="email"
          onChange={this.handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onChange={this.handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    );
  }
}
