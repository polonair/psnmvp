import React, { Component } from "react";
import { invokeApigU } from "../libs/awsLib";

export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      link: null,
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getLink();
      this.setState({
        loaded: true,
        link: results,
        content: results.content
      });
    } catch (e) {
      this.setState({ loaded: true });
      //alert(e);
    }
  }

  getLink = () => invokeApigU({ path: `/links/get/${this.props.match.params.id}` });

  renderProfileDetail() {
    return (
      <table class="table">
        <tbody>
          <tr><td>Sex</td><td>{this.state.link.sex=='male'?'Male':'Female'}</td></tr>
          <tr><td>Birthday</td><td>{this.state.link.birthday}</td></tr>
          <tr><td>Term of illness</td><td>{this.state.link.illnessTerm}</td></tr>
          <tr>
            <td>Diagnosis</td>
            <td>
              { Array.isArray(this.state.link.diagnosis)?[].concat(this.state.link.diagnosis).map((entry, i) => {return (<span>{entry}, </span>); }):"-" }
            </td>
          </tr>

          <tr>
            <td>Symptoms</td>
            <td>
              {Array.isArray(this.state.link.symptoms)?[].concat(this.state.link.symptoms).map((entry, i) => {return (<span>{entry}, </span>); }):"-"}
            </td>
          </tr>


        <tr>
          <td>Hospitals</td>
          <td>
            {Array.isArray(this.state.link.hospitals)?[].concat(this.state.link.hospitals).map((entry, i) => {return (<span>{entry}, </span>); }):"-"}
          </td>
        </tr>
        <tr>
          <td>Doctors</td>
          <td>
            {Array.isArray(this.state.link.doctors)?[].concat(this.state.link.doctors).map((entry, i) => {return (<span>{entry}, </span>); }):"-"}
          </td>
        </tr>
        <tr>
          <td>Procedures</td>
          <td>
            {Array.isArray(this.state.link.procedures)?[].concat(this.state.link.procedures).map((entry, i) => {return (<span>{entry}, </span>); }):"-"}
          </td>
        </tr>
        <tr>
          <td>Alternative medicine</td>
          <td>
            {Array.isArray(this.state.link.alternatives)?[].concat(this.state.link.alternatives).map((entry, i) => {return (<span>{entry}, </span>); }):"-"}
          </td>
        </tr>




          <tr>
            <td>Medicaments</td>
            <td>
              <ul>
                {[].concat(this.state.link.medicaments).map((entry, i) => { 
                  return (<li>{entry.name}; {entry.dosage}; {entry.times}; {entry.term}</li>); })}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Supplements</td>
            <td>
              <ul>
                {[].concat(this.state.link.supplements).map((entry, i) => { 
                  return (<li>{entry.name}; {entry.dosage}; {entry.times}; {entry.term}</li>); })}
              </ul>
            </td>
          </tr>
        </tbody>
        </table>
      );
  }

  render() {
    return (
      <div className="Link">
        { this.state.loaded ? (this.state.link == null ? "Not found" : this.renderProfileDetail()) : "Searching..." }
      </div>);
  }
}