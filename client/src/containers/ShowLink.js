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

  getLink() {
    return invokeApigU({ path: `/links/${this.props.match.params.id}` });
  }

  renderProfileDetail() {
    return (
      <table class="table">
        <tbody>
        <tr> <td>birthday</td>             <td>{this.state.link.birthday}</td>              </tr>
        <tr> <td>gender</td>               <td>{this.state.link.gender}</td>                </tr>
        <tr> <td>symptoms_active</td>      <td>{this.state.link.symptoms_active}</td>       </tr>
        <tr> <td>symptoms_past</td>        <td>{this.state.link.symptoms_past}</td>         </tr>
        <tr> <td>diagnosis_possible</td>   <td>{this.state.link.diagnosis_possible}</td>    </tr>
        <tr> <td>diagnosis_active</td>     <td>{this.state.link.diagnosis_active}</td>      </tr>
        <tr> <td>diagnosis_past</td>       <td>{this.state.link.diagnosis_past}</td>        </tr>
        <tr> <td>medicaments_active</td>   <td>{this.state.link.medicaments_active}</td>    </tr>
        <tr> <td>medicaments_past</td>     <td>{this.state.link.medicaments_past}</td>      </tr>
        <tr> <td>hospitals</td>            <td>{this.state.link.hospitals}</td>             </tr>
        <tr> <td>doctors</td>              <td>{this.state.link.doctors}</td>               </tr>
        <tr> <td>procedures</td>           <td>{this.state.link.procedures}</td>            </tr>
        <tr> <td>alternative_medicine</td> <td>{this.state.link.alternative_medicine }</td> </tr>
        <tr> <td>supplement</td>           <td>{this.state.link.supplement}</td>            </tr>
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