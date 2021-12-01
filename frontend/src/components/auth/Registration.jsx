import React, { Component } from "react";
import axios from "axios";
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password_confirmation: "",
      registrationErrors: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (event) => {
    const { email, password, password_confirmation } = this.state;
    axios
      .post(
        "http://localhost:3000/registrations",
        {
          user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.status === "created") {
          this.props.handleSuccessfulAuth(res.data);
        }
      })
      .catch((err) => {
        console.log("registration err", err);
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
