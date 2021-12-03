import React, { Component } from "react";
import axios from "axios";
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
    const { email, password } = this.state;
    axios
      .post(
        "http://localhost:3000/users/signin",
        {
          user: {
            email: email,
            password: password,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("login res", res);
      })
      .catch((err) => {
        console.log("login err", err);
      });
    event.preventDefault();
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
