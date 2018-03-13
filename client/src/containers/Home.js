import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";
import { FormGroup, FormControl, ControlLabel, Table, Form, Col, Modal } from "react-bootstrap";
import { Button, Glyphicon } from "react-bootstrap";
import "./Home.css";
import { invokeApig } from '../libs/awsLib';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect, RIEDate } from '../riek';
import _ from 'lodash';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      form: null,
      profile: null
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getProfile();
      console.log(results);
      if (results == null) {
        this.props.history.push("/new");
      }
      else{
        var frm = {};
        if (results.sex == 'male') frm['sex'] = {id:'male', text: 'Male'};
        else if (results.sex == 'female') frm['sex'] = {id:'female', text: 'Female'};
        frm['birthday'] = results.birthday;
        frm['illnessTerm'] = results.illnessTerm;
        frm['supplements'] = results.supplements;
        frm['medicaments'] = results.medicaments;
        frm['symptoms'] = new Set(Array.isArray(results.symptoms)?results.symptoms:[]);
        frm['diagnosis'] = new Set(Array.isArray(results.diagnosis)?results.diagnosis:[]);
        frm['hospitals'] = new Set(Array.isArray(results.hospitals)?results.hospitals:[]);
        frm['doctors'] = new Set(Array.isArray(results.doctors)?results.doctors:[]);
        frm['procedures'] = new Set(Array.isArray(results.procedures)?results.procedures:[]);
        frm['alternatives'] = new Set(Array.isArray(results.alternatives)?results.alternatives:[]);
        frm['suppBuffer'] = { name: "", dosage: "", times: "", term: "" };
        frm['medBuffer'] = { name: "", dosage: "", times: "", term: "" };

        this.setState({
          isLoading: false,
          profile: results,
          form: frm
        });        
      }
    } catch (e) {
      console.log(e);
    }
  }

  getProfile = () => 
    invokeApig({ path: `/profiles/get` });

  updateProfile = (profile) => 
    invokeApig({ path: `/profiles/update`, method: "PUT", body: profile }); 

  httpProfileCallback = async (params) => {
    var frm = this.state.form;
    var profl = this.state.profile;
    if ('sex' in params){
      frm.sex = params.sex;
      profl.sex = params.sex.id;
    }
    if ('birthday' in params){
      frm.birthday = params.birthday;
      profl.birthday = params.birthday;
    }
    if ('illnessTerm' in params){
      frm.illnessTerm = params.illnessTerm;
      profl.illnessTerm = params.illnessTerm;
    }
    if ('symptoms' in params){
      frm.symptoms = params.symptoms;
      profl.symptoms = Array.from(params.symptoms);
    }
    if ('diagnosis' in params){
      frm.diagnosis = params.diagnosis;
      profl.diagnosis = Array.from(params.diagnosis);
    }
    if ('hospitals' in params){
      frm.hospitals = params.hospitals;
      profl.hospitals = Array.from(params.hospitals);
    }
    if ('doctors' in params){
      frm.doctors = params.doctors;
      profl.doctors = Array.from(params.doctors);
    }
    if ('procedures' in params){
      frm.procedures = params.procedures;
      profl.procedures = Array.from(params.procedures);
    }
    if ('alternatives' in params){
      frm.alternatives = params.alternatives;
      profl.alternatives = Array.from(params.alternatives);
    }
    this.setState({form: frm, profile: profl});
    await this.updateProfile(this.state.profile);
  }

  handleSuppChange = (event) => {
    var frm = this.state.form;
    frm.suppBuffer[event.target.id] = event.target.value;
    this.setState({ form: frm }); 
  }

  handleMedChange = (event) => {
    var frm = this.state.form;
    frm.medBuffer[event.target.id] = event.target.value;
    this.setState({ form: frm }); 
  }

  addSupplement = async (event) => {
    event.preventDefault();
    var frm = this.state.form;
    frm.supplements.push(frm.suppBuffer);
    frm.suppBuffer = { name: "", dosage: "", times: "", term: "" };
    var profl = this.state.profile;
    profl.supplements = frm.supplements;
    await this.updateProfile(profl);   
    this.setState({ form: frm, profile: profl, showSupplModal: false });  
  }

  addMedicament = async (event) => {
    event.preventDefault();
    var frm = this.state.form;
    frm.medicaments.push(frm.medBuffer);
    frm.medBuffer = { name: "", dosage: "", times: "", term: "" };
    var profl = this.state.profile;
    profl.medicaments = frm.medicaments;
    await this.updateProfile(profl);   
    this.setState({ form: frm, profile: profl, showMedModal: false });  
  }

  doShowSupplModal = () => { this.setState({showSupplModal: true}) }
  doHideSupplModal = () => { this.setState({showSupplModal: false}) }

  doShowMedModal = () => { this.setState({showMedModal: true}) }
  doHideMedModal = () => { this.setState({showMedModal: false}) }

  renderSupplementForm = () => {
    return (
      <div>
        <Button type="button" onClick={ this.doShowSupplModal }>Add</Button>
        <Modal show={this.state.showSupplModal} onHide={ this.doHideSupplModal }>
          <Form horizontal onSubmit={this.addSupplement}>
            <Modal.Header closeButton><Modal.Title>Add supplement</Modal.Title></Modal.Header>
            <Modal.Body>
                <FormGroup controlId="name">
                  <Col componentClass={ControlLabel} sm={3}>Name</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.suppBuffer.name} onChange={this.handleSuppChange} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="dosage">
                  <Col componentClass={ControlLabel} sm={3}>Dosage</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.suppBuffer.dosage} onChange={this.handleSuppChange} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="times">
                  <Col componentClass={ControlLabel} sm={3}>Times per day</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.suppBuffer.times} onChange={this.handleSuppChange} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="term">
                  <Col componentClass={ControlLabel} sm={3}>Term</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.suppBuffer.term} onChange={this.handleSuppChange} />
                  </Col>
                </FormGroup>
            </Modal.Body>   
            <Modal.Footer>   
                <FormGroup>
                  <Col smOffset={3} sm={9}>
                    <Button type="submit">Add</Button>
                  </Col>
                </FormGroup>
            </Modal.Footer>    
          </Form>   
        </Modal>
      </div>
    );
  }

  renderMedicamentForm = () => {
    return (
      <div>
        <Button type="button" onClick={ this.doShowMedModal }>Add</Button>
        <Modal show={this.state.showMedModal} onHide={ this.doHideMedModal }>
          <Form horizontal onSubmit={this.addMedicament}>
            <Modal.Header closeButton><Modal.Title>Add medicament</Modal.Title></Modal.Header>
            <Modal.Body>
                <FormGroup controlId="name">
                  <Col componentClass={ControlLabel} sm={3}>Name</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.medBuffer.name} onChange={this.handleMedChange} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="dosage">
                  <Col componentClass={ControlLabel} sm={3}>Dosage</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.medBuffer.dosage} onChange={this.handleMedChange} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="times">
                  <Col componentClass={ControlLabel} sm={3}>Times per day</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.medBuffer.times} onChange={this.handleMedChange} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="term">
                  <Col componentClass={ControlLabel} sm={3}>Term</Col>
                  <Col sm={9}>
                    <FormControl type="text" value={this.state.form.medBuffer.term} onChange={this.handleMedChange} />
                  </Col>
                </FormGroup>
            </Modal.Body>   
            <Modal.Footer>   
                <FormGroup>
                  <Col smOffset={3} sm={9}>
                    <Button type="submit">Add</Button>
                  </Col>
                </FormGroup>
            </Modal.Footer>    
          </Form>   
        </Modal>
      </div>
    );
  }

  removeSupplement = async (event) => {
    event.preventDefault();
    var id = event.target.getAttribute('data-pos');

    var frm = this.state.form;
    frm.supplements.splice(id-1, 1);
    var profl = this.state.profile;
    profl.supplements = frm.supplements;
    this.setState({ form: frm, profile: profl });  
    await this.updateProfile(this.state.profile); 
  }

  removeMedicament = async (event) => {
    event.preventDefault();
    var id = event.target.getAttribute('data-pos');

    var frm = this.state.form;
    frm.medicaments.splice(id-1, 1);
    var profl = this.state.profile;
    profl.medicaments = frm.medicaments;
    this.setState({ form: frm, profile: profl });  
    await this.updateProfile(this.state.profile); 
  }

  renderSupplement(entry, i){
    return (
      <div>
        <span>{entry.name}; </span>
        <span>{entry.dosage}; </span>
        <span>{entry.times}; </span>
        <span>{entry.term}; </span>
        <a href="#" data-pos={i} onClick={this.removeSupplement}>Delete</a>
      </div>
    );
  }

  renderMedicament(entry, i){
    return (
      <div>
        <span>{entry.name}; </span>
        <span>{entry.dosage}; </span>
        <span>{entry.times}; </span>
        <span>{entry.term}; </span>
        <a href="#" data-pos={i} onClick={this.removeMedicament}>Delete</a>
      </div>
    );
  }

  renderSupplements(supplements){
    return [{}].concat(supplements).map((entry, i) => 
      (i == 0)?(this.renderSupplementForm()):(this.renderSupplement(entry, i)));
  }

  renderMedicaments(medicaments){
    return [{}].concat(medicaments).map((entry, i) => 
      (i == 0)?(this.renderMedicamentForm()):(this.renderMedicament(entry, i)));
  }

  renderProfileDetail() {
    return (
      <Table><tbody>
        <tr>
          <td>Sex</td>
          <td>
            <RIESelect  
              value={this.state.form.sex}
              change={this.httpProfileCallback} 
              propName='sex' 
              options={[
                {id: 'male', text: 'Male'},
                {id: 'female', text: 'Female'}
              ]}/>        
          </td>
        </tr>
        <tr>
          <td>Birthday</td>
          <td>
            <RIEDate  
              value={this.state.form.birthday}
              change={this.httpProfileCallback} 
              propName='birthday'/>
          </td>
        </tr>
        <tr>
          <td>Term of illness</td>
          <td>
            <RIEDate  
              value={this.state.form.illnessTerm}
              change={this.httpProfileCallback} 
              propName='illnessTerm'/>
          </td>
        </tr>
        <tr>
          <td>Symptoms</td>
          <td>
            <RIETags
              value={this.state.form.symptoms}
              change={this.httpProfileCallback} 
              propName='symptoms'/>
          </td>
        </tr>
        <tr>
          <td>Diagnosis</td>
          <td>
            <RIETags
              value={this.state.form.diagnosis}
              change={this.httpProfileCallback} 
              propName='diagnosis'/>
          </td>
        </tr>

        <tr>
          <td>Hospitals</td>
          <td>
            <RIETags
              value={this.state.form.hospitals}
              change={this.httpProfileCallback} 
              propName='hospitals'/>
          </td>
        </tr>
        <tr>
          <td>Doctors</td>
          <td>
            <RIETags
              value={this.state.form.doctors}
              change={this.httpProfileCallback} 
              propName='doctors'/>
          </td>
        </tr>
        <tr>
          <td>Procedures</td>
          <td>
            <RIETags
              value={this.state.form.procedures}
              change={this.httpProfileCallback} 
              propName='procedures'/>
          </td>
        </tr>
        <tr>
          <td>Alternative medicine</td>
          <td>
            <RIETags
              value={this.state.form.alternatives}
              change={this.httpProfileCallback} 
              propName='alternatives'/>
          </td>
        </tr>

        <tr>
          <td>Medicaments</td>
          <td>
            {this.renderMedicaments(this.state.form.medicaments)}
          </td>
        </tr>
        <tr>
          <td>Supplements</td>
          <td>
            {this.renderSupplements(this.state.form.supplements)}
          </td>
        </tr>
      </tbody></Table>
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
