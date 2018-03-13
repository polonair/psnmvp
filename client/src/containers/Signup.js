import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import config from "../config";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      haveLetter: false,
      isLoading: false,
      username: "",
      forwho: "",
      question: "",
      answer: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.username.length > 0 &&
      this.state.password.length >= 8 &&
      this.state.question.length > 0 &&
      this.state.answer.length > 0 &&
      this.state.forwho.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    if (event.target.id == 'forwho')
    {
      var un = this.state.username;
      if (this.state.haveLetter)
      {
        un = un.slice(0, -2);
      }
      switch(event.target.value)
      {
        case "me": un+="ME"; break;
        case "parent": un+="PR"; break;
        case "sibling": un+="SB"; break;
        case "friend": un+="FR"; break;
        case "spouse": un+="SP"; break;
        case "child": un+="CH"; break;
        case "patient": un+="PT"; break;
      }
      this.setState({ username: un, haveLetter: true });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const newUser = await this.signup(
        this.state.username, 
        this.state.password, 
        this.state.question, 
        this.state.answer);
      this.setState({
        newUser: newUser
      });
      await this.authenticate(
        this.state.newUser,
        this.state.username,
        this.state.password
      );

      this.props.userHasAuthenticated(true);
      localStorage.setItem('LastUser', this.state.username);
      this.props.history.push("/");
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false });
    }
  }


  signup(email, password, question, answer) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    var attributeList = [];
    attributeList.push(
      new CognitoUserAttribute(
        { Name : 'custom:secret_question', Value : question }));
    attributeList.push(
      new CognitoUserAttribute(
        { Name : 'custom:secret_answer',    Value : answer }));

    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      })
    );
  }

  authenticate(user, email, password) {
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  createLogin(){
    if (this.state.username.length <= 0 ){
      var text = "PN";
      var possible = "0123456789";
      for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      this.setState({ username: text });
    }
    return this.state.username;
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="username" bsSize="large">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            onChange={this.handleChange}
            readOnly="readonly"
            value={this.createLogin()}
          />
        </FormGroup>

        <FormGroup controlId="forwho" bsSize="large">
          <ControlLabel>I want to create profile for</ControlLabel>
          <FormControl
            type="text" 
            onChange={this.handleChange}
            componentClass="select" 
            defaultValue="none"
            placeholder="Select option">
              <option value="none" disabled="disabled">Please, select an option</option>
              <option value="me">me</option>
              <option value="parent">my parent</option>
              <option value="sibling">my sibling</option>
              <option value="friend">my friend</option>
              <option value="spouse">my spouse</option>
              <option value="child">my child</option>
              <option value="patient">my patient</option>
            </FormControl>
        </FormGroup>

        <FormGroup controlId="question" bsSize="large">
          <ControlLabel>Secret question</ControlLabel>
          <FormControl
            type="text" 
            onChange={this.handleChange}
            componentClass="select" 
            defaultValue="none"
            placeholder="Select question">
              <option value="none" disabled="disabled">Please, select question</option>
              <option value="What is the first name of the person you first kissed?">
                What is the first name of the person you first kissed?</option>
              <option value="What is the last name of the teacher who gave you your first failing grade?">
                What is the last name of the teacher who gave you your first failing grade?</option>
              <option value="What was the name of your elementary / primary school?">
                What was the name of your elementary / primary school?</option>
              <option value="In what city or town does your nearest sibling live?">
                In what city or town does your nearest sibling live?</option>
              <option value="What time of the day were you born? (hh:mm)">
                What time of the day were you born? (hh:mm)</option>
          </FormControl>
        </FormGroup>
        <FormGroup controlId="answer" bsSize="large">
          <ControlLabel>Answer</ControlLabel>
          <FormControl
            type="text"
            onChange={this.handleChange}
            required="required"
          />
        </FormGroup>

        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password (at least 8 charachters)</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        { this.renderForm() }
      </div>
    );
  }
}