import React from "react";
import { Component } from "react";
import Registration from "../../components/auth/Registration";
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }

  handleSuccessfulAuth(data) {
    // ToDo update parent component
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
        <Registration handleSuccessfulAuth={this.handleSuccessfulAuth} />
      </div>
    );
  }
}
