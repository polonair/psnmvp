import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, Button } from "react-bootstrap";
import LoaderButton from "./components/LoaderButton";

import { FormGroup, FormControl, ControlLabel, Table, Form, Col, Modal } from "react-bootstrap";
import Routes from "./Routes";
import "./App.css";
import RouteNavItem from "./components/RouteNavItem";
import { authUser, signOutUser } from "./libs/awsLib";
import { invokeApig } from "./libs/awsLib";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showShareModal: false,
      isAuthenticated: false,
      isAuthenticating: true,

      //

      isLoading: null,
      duration: 3600000,
      linkGotten: false,
      link: ""
    };
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      alert(e);
    }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  doShowShareModal = () => this.setState({showShareModal: true});
  doHideShareModal = () => this.setState({showShareModal: false});


  handleSubmit = async event => {
    if (this.state.linkGotten) {
      event.preventDefault();
      this.props.history.push("/");
    } else {
      event.preventDefault();
      this.setState({ isLoading: true });
      try {
        var link = await this.createLink({ duration: this.state.duration });
        this.setState({ 
          linkGotten: true, 
          link: window.location.protocol + "//" + window.location.host + "/link/" + link.linkId, 
          isLoading: false
        });
      } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
      }
    }
  }

  renderSharingsForm = () => {
    return (
      <div>
        <Modal show={this.state.showShareModal} onHide={ this.doHideShareModal }>
          <Form horizontal onSubmit={this.handleSubmit}>
            <Modal.Header closeButton><Modal.Title>Share profile</Modal.Title></Modal.Header>
            <Modal.Body>
              <FormGroup controlId="duration" bsSize="large">
                <FormControl
                  type="text" 
                  onChange={this.handleChange}
                  componentClass="select" >
                    <option value="3600000" selected="selected">Link will be active for 1 hour</option>
                    <option value="86400000">Link will be active for 1 day</option>
                    <option value="604800000">Link will be active for 1 week</option>
                    <option value="0">Link will be active forever</option>
                </FormControl>
              </FormGroup>
              <p><a href={this.state.link}>{this.state.link}</a></p>              
            </Modal.Body>   
            <Modal.Footer>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                type="submit"
                isLoading={this.state.isLoading}
                text={this.state.linkGotten ? "Ok" : "Create"}
                loadingText="Creating…"
              />
            </Modal.Footer>    
          </Form>   
        </Modal>
      </div>
    );
  }

  handleSharing = event => this.doShowShareModal();

  createLink = (link) => invokeApig({ path: "/links/new", method: "POST", body: link });

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">PsnAws</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? [
                    <RouteNavItem key={1} href="/history">History</RouteNavItem>,
                    <NavItem key={2} onClick={this.handleSharing}>Share Profile</NavItem>,
                    <NavItem key={3} onClick={this.handleLogout}>Logout</NavItem>
                  ]
                : [
                    <RouteNavItem key={1} href="/signup">Signup</RouteNavItem>,
                    <RouteNavItem key={2} href="/login">Login</RouteNavItem>
                  ]}              
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.renderSharingsForm()}
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
