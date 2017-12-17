import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./ShareProfile.css";
import { invokeApig } from "../libs/awsLib";

export default class ShareProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      duration: 3600000,
      linkGotten: false,
      link: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    if (this.state.linkGotten) {
      event.preventDefault();
      this.props.history.push("/");
    } else {
      event.preventDefault();
      this.setState({ isLoading: true });
      try {
        const results = await this.profiles();
        var link = await this.createLink({ profileId: results[0].profileId, duration: this.state.duration });
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

  createLink(link) {
    return invokeApig({
      path: "/links",
      method: "POST",
      body: link
    });
  }

  profiles() {
    return invokeApig({ path: "/profiles" });
  }

  render() {
    return (
      <div className="ShareProfile">
        <form onSubmit={this.handleSubmit}>
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
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            type="submit"
            isLoading={this.state.isLoading}
            text={this.state.linkGotten ? "Ok" : "Create"}
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}