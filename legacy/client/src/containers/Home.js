import React, { Component } from "react";
import { PageHeader, Table } from "react-bootstrap";
import "./Home.css";
import { invokeApig } from '../libs/awsLib';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import _ from 'lodash';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profile: null
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getProfile();
      this.setState({
        isLoading: false,
        profile: results[0]
      });
    } catch (e) {}
  }

  getProfile() { return invokeApig({ path: `/profiles` }); }

  httpProfileCallback = (profile) => {
    return invokeApig({
      path: `/profiles/${this.state.profile.profileId}`,
      method: "PUT",
      body: profile
    }); 
  }

  renderProfileDetail() {
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

  renderProfile() {
    console.log(this.state.profile);
    return (
      <div className="profile">
        <PageHeader>Your Profile</PageHeader>
        {!this.state.isLoading && this.renderProfileDetail(this.state.profile)}
      </div>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>PsnAws</h1>
        <p>Patient social network on AWS</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderProfile() : this.renderLander()}
      </div>
    );
  }
}
