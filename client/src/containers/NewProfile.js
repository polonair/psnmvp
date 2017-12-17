import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Table } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
//import "./NewProfile.css";
import { invokeApig } from "../libs/awsLib";
import { PageHeader } from "react-bootstrap";
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import _ from 'lodash';

export default class NewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      profile: {
        birthday: "empty",
        gender: "empty",
        symptoms_active: "empty",
        symptoms_past: "empty",
        diagnosis_possible: "empty",
        diagnosis_active: "empty",
        diagnosis_past: "empty",
        medicaments_active: "empty",
        medicaments_past: "empty",
        hospitals: "empty",
        doctors: "empty",
        procedures: "empty",
        alternative_medicine: "empty",
        supplement: "empty",
      }
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => { this.file = event.target.files[0]; }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this.createProfile(this.state.profile);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createProfile(profile) {
    return invokeApig({
      path: "/profiles",
      method: "POST",
      body: profile
    });
  }

  httpProfileCallback = (prof) => {
    var new_profile = this.state.profile;
    for (var attr in prof) {
      new_profile[attr] = prof[attr];
    }
    this.setState({ profile: new_profile});
    console.log(this.state.profile);
  }

  renderProfile() {
    return (
      <Table>
        <tbody>
        <tr>
          <td>birthday</td>
          <td>
            <RIEInput 
            value={this.state.profile.birthday} 
            change={this.httpProfileCallback} 
            propName='birthday' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>gender</td>
          <td>
            <RIEInput 
            value={this.state.profile.gender} 
            change={this.httpProfileCallback} 
            propName='gender' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>symptoms_active</td>
          <td>
            <RIEInput 
            value={this.state.profile.symptoms_active} 
            change={this.httpProfileCallback} 
            propName='symptoms_active' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>symptoms_past</td>
          <td>
            <RIEInput 
            value={this.state.profile.symptoms_past} 
            change={this.httpProfileCallback} 
            propName='symptoms_past' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>diagnosis_possible</td>
          <td>
            <RIEInput 
            value={this.state.profile.diagnosis_possible} 
            change={this.httpProfileCallback} 
            propName='diagnosis_possible' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>diagnosis_active</td>
          <td>
            <RIEInput 
            value={this.state.profile.diagnosis_active} 
            change={this.httpProfileCallback} 
            propName='diagnosis_active' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>diagnosis_past</td>
          <td>
            <RIEInput 
            value={this.state.profile.diagnosis_past} 
            change={this.httpProfileCallback} 
            propName='diagnosis_past' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>medicaments_active</td>
          <td>
            <RIEInput 
            value={this.state.profile.medicaments_active} 
            change={this.httpProfileCallback} 
            propName='medicaments_active' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>medicaments_past</td>
          <td>
            <RIEInput 
            value={this.state.profile.medicaments_past} 
            change={this.httpProfileCallback} 
            propName='medicaments_past' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>hospitals</td>
          <td>
            <RIEInput 
            value={this.state.profile.hospitals} 
            change={this.httpProfileCallback} 
            propName='hospitals' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>doctors</td>
          <td>
            <RIEInput 
            value={this.state.profile.doctors} 
            change={this.httpProfileCallback} 
            propName='doctors' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>procedures</td>
          <td>
            <RIEInput 
            value={this.state.profile.procedures} 
            change={this.httpProfileCallback} 
            propName='procedures' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>alternative_medicine</td>
          <td>
            <RIEInput 
            value={this.state.profile.alternative_medicine } 
            change={this.httpProfileCallback} 
            propName='alternative_medicine' 
            validate={_.isString} />
          </td>
        </tr>
        <tr>
          <td>supplement</td>
          <td>
            <RIEInput 
            value={this.state.profile.supplement} 
            change={this.httpProfileCallback} 
            propName='supplement' 
            validate={_.isString} />
          </td>
        </tr>
        </tbody>
        </Table>
      );
  }

  render() {
    return (
      <div className="profile">
        <PageHeader>Your Profile</PageHeader>
        {this.renderProfile()}
        <form onSubmit={this.handleSubmit}>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            type="submit"
            isLoading={this.state.isLoading}
            text="Done"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}