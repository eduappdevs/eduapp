import React, { Component } from "react";
import API from "../../API";
import BasicGoogleLogin from "../basicGoogleLogin/BasicGoogleLogin";
import StandardModal from "../modals/standard-modal/StandardModal";
import { Mailer } from "../Mailer";
export default class LoginAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      forgotModalShow:false,
      sendEmail:false,
      emailSentModalShow:false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showEmailSentModal = this.showEmailSentModal.bind(this);
    
  }

  handleSubmit = async (event) => {
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


  showEmailSentModal = () => {
    this.setState({
      emailSentModalShow: true,
    });
  }


  
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
        <div onClick={()=>{this.setState({forgotModalShow:true})}} className='forgottenPassword'>Forgot password?</div>
        <StandardModal 
          type={'info'} 
          text='To what email should we send the password recovery?' 
          form={<Mailer showEmailSent={this.showEmailSentModal} email={this.state.email} sendEmail={this.state.sendEmail}/>} 
          show={this.state.forgotModalShow} 
          onCloseAction={()=>{this.setState({forgotModalShow:false,sendEmail:true})}}
          hasIconAnimation
          hasTransition
          />
        <StandardModal type={'success'} text={'Email Sent Successfully'} hasIconAnimation hasTransition show={this.state.emailSentModalShow} onCloseAction={()=>{this.setState({emailSentModalShow:false})}}/>
        <button data-testid="loginButton" type="submit">
          Login
        </button>
        <span style={{ color: "white" }}>
          <br />
          or
        </span>
        <BasicGoogleLogin />
        <img src="\assets\logo.png" alt="" />
      </form>
      
    );
  }
}
