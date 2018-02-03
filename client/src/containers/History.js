import React, { Component } from "react";
import "./History.css";
import { 
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  PageHeader,
  Panel,
  Glyphicon,
} from "react-bootstrap";
import { 
  invokeApig,
  s3Upload,
} from '../libs/awsLib';
import LoaderButton from "../components/LoaderButton";
import config from "../config";

class NewHistoryEntry extends Component{
  constructor(props) {
    super(props);
    this.files = null;
    this.state = {
      processing: false,
      hidden: true,
      message: "",
      postDate: ""
    };
  }
  createEntry = (entry) => invokeApig({ path: "/entries/new", method: "POST", body: entry });
  showModal = () => { this.setState({ hidden: false }) }
  hideModal = () => { this.setState({ hidden: true }) }
  onSubmit = async (event) => {
    event.preventDefault();
    var filesok = true;

    if (this.files && this.files.length > 0){
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].size > config.MAX_ATTACHMENT_SIZE) filesok = false;
      }
    }
    if (!filesok) {
      alert("One of your files had a size more than 5MB, please, pick files smaller.");
    }
    else{
      this.setState({ processing: true });
      var uploadedFilesNames = null;
      var createArgs = {
        date: this.state.postDate,
        message: this.state.message, 
        postDate: this.state.postDate,
        attachments: []
      };

      if (this.files && this.files.length > 0){
        for (var i = 0; i < this.files.length; i++) {
          var fileLink = (await s3Upload(this.files[i])).Location;
          createArgs.attachments.push({ name: this.files[i].name, link: fileLink });
        }
      }
      var result = await this.createEntry(createArgs);
      this.setState({ processing: false });
      this.hideModal();
      this.props.created();
    }
  }
  onChange = (event) => { this.setState({ [event.target.id]: event.target.value }); }
  onFileChange = (event) => { this.files = event.target.files; }


  render = () => 
    <div>
      <Button type="button" onClick={ this.showModal }>New entry</Button>
      <Modal show={ !this.state.hidden } onHide={ this.hideModal }>
        <Form onSubmit={this.onSubmit}>
          <Modal.Header closeButton><Modal.Title>New history entry</Modal.Title></Modal.Header>
          <Modal.Body>
            <FormGroup controlId="postDate" bsSize="large">
              <ControlLabel>Date</ControlLabel>
              <FormControl type="date" onChange={ this.onChange } />
            </FormGroup>
            <FormGroup controlId="message" bsSize="large">
              <ControlLabel>Message</ControlLabel>
              <FormControl componentClass="textarea" style={{ height: 200 }} onChange={ this.onChange }></FormControl>
            </FormGroup>
            <FormGroup controlId="file">
              <ControlLabel>Attachments</ControlLabel>
              <FormControl onChange={this.onFileChange} type="file" multiple/>
            </FormGroup>            
          </Modal.Body>   
          <Modal.Footer>
            <Button type="button" onClick={ this.hideModal }>Cancel</Button>
            <LoaderButton              
              bsStyle="primary"
              type="submit"
              isLoading={this.state.processing}
              text="Post"
            />
          </Modal.Footer>
        </Form>
      </Modal>
    </div>;
}

class HistoryEntry extends Component{
  constructor(props) {
    super(props);
    this.files = null;
    this.state = { 
      filesToRemove: [],
      entry: null,
      updatedEntry: null,
      editMode: false,
      processing: false,
    };
  }
  componentDidMount = () => { 
    this.setState({ entry: this.props.entry });
  }
  renderAttachments = (attachments) =>
    [].concat(attachments).map( 
      (attachment, i) => 
        <li key={i}><a href={ attachment.link }>{ attachment.name }</a></li>
    );
  editClick = (event) => {
    event.preventDefault();
    this.files = null;
    this.props.beforeEdit({ entryId: this.props.entry.entryId });
    this.setState({ editMode: true, updatedEntry: Object.assign({}, this.state.entry), filesToRemove: [] });
  }
  removeClick = async (event) => {
    event.preventDefault();
    await this.removeEntry(this.state.entry.entryId);
    this.props.afterEdit({ changed: true });
  }
  cancelClick = (event) => {
    event.preventDefault();
    this.setState({ editMode: false });
  }
  onChange = (event) => {
    event.preventDefault();
    var e = this.state.updatedEntry;
    e[event.target.id] = event.target.value;
    this.setState({ updatedEntry: e });
  }
  onSubmit = async (event) => {
    event.preventDefault();
    var filesok = true;

    if (this.files && this.files.length > 0){
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].size > config.MAX_ATTACHMENT_SIZE) filesok = false;
      }
    }
    if (!filesok) {
      alert("One of your files had a size more than 5MB, please, pick files smaller.");
      return;
    }
    else{
      this.setState({ processing: true });
      var atts = this.state.updatedEntry.attachments;

      for (var i = 0; i < this.state.filesToRemove.length; i++){
        atts.splice(this.state.filesToRemove[i], 1);
      }
      if (this.files && this.files.length > 0){
        for (var i = 0; i < this.files.length; i++) {
          var fileLink = (await s3Upload(this.files[i])).Location;
          atts.push({ name: this.files[i].name, link: fileLink });
        }
      }
      var ae = this.state.updatedEntry;
      ae.attachments = atts;

      await this.updateEntry(ae);
      this.setState({ processing: false });
      this.props.afterEdit({ changed: true });
    }
  }
  updateEntry = async (entry) => invokeApig({ 
    path: `/entries/update/${entry.entryId}`,
    method: "PUT",
    body: entry
  });
  removeEntry = async (id) => invokeApig({ 
    path: `/entries/delete/${id}`,
    method: "DELETE"
  });
  onFileChange = (event) => { this.files = event.target.files; }
  removeAttachment = (event) => {
    event.preventDefault();
    var target = event.target.attributes["data-attid"].value;
    var f2r = this.state.filesToRemove.concat([target]);
    this.setState({ filesToRemove: f2r });
  }
  cancelRemoveAttachment = (event) => {
    event.preventDefault();
    var target = event.target.attributes["data-attid"].value;
    var f2r = this.state.filesToRemove;
    f2r.splice(f2r.indexOf(target), 1);
    this.setState({ filesToRemove: f2r });
  }
  renderAttachmentsOnForm = (attachments) =>
    [].concat(attachments).map( 
      (attachment, i) =>{
        if (this.state.filesToRemove.includes(i+"")){
          return <li key={i}>
            <del><a href={ attachment.link }>{ attachment.name }</a></del>&nbsp;
            <a href="#" data-attid={i} onClick={ this.cancelRemoveAttachment }>Cancel</a>
          </li>;
        }
        else{
          return <li key={i}>
            <a href={ attachment.link }>{ attachment.name }</a>&nbsp;
            <a href="#" data-attid={i} onClick={ this.removeAttachment }>Remove</a>
          </li>;
        }
      }, this
    );

  renderForm = () => 
    <Form onSubmit={this.onSubmit}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="panel-title">
            Editing
            <div className="pull-right"><a href="edit" onClick={this.cancelClick}><Glyphicon glyph="remove" /></a></div>
          </div>
        </div>
        <div className="panel-body">        
          <FormGroup controlId="postDate">
            <ControlLabel>Date</ControlLabel>
            <FormControl type="date" onChange={ this.onChange }  value={ this.state.updatedEntry.postDate } />
          </FormGroup>
          <FormGroup controlId="message">
            <ControlLabel>Message</ControlLabel>
            <FormControl componentClass="textarea" style={{ height: 200 }} onChange={ this.onChange } value={ this.state.updatedEntry.message } />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachments</ControlLabel>
            <ul>{
              this.state.updatedEntry && 
              Array.isArray(this.state.updatedEntry.attachments) && 
              (this.state.updatedEntry.attachments.length > 0) && 
              this.renderAttachmentsOnForm(this.state.updatedEntry.attachments) 
            }</ul>
            <FormControl onChange={this.onFileChange} type="file" multiple/>
          </FormGroup>
        </div>
        <div className="panel-footer text-right">
          <LoaderButton 
            bsStyle="primary"
            type="submit"
            isLoading={ this.state.processing }
            text="Save" />
        </div>
      </div>
    </Form>;

  renderContent = () =>
    <div className="panel panel-default">
        <div className="panel-heading">
          <div className="panel-title">
            { this.state.entry && this.state.entry.postDate }
            <div className="pull-right">
              <a href="edit" onClick={this.editClick}><Glyphicon glyph="pencil" /></a>&nbsp;
              <a href="remove" onClick={this.removeClick} className="text-danger"><Glyphicon glyph="trash" /></a>
            </div>
          </div>
        </div>
        <div className="panel-body">{ this.state.entry && this.state.entry.message }</div>
        <div className="panel-footer">
          <ul>{
            this.state.entry && 
            Array.isArray(this.state.entry.attachments) && 
            (this.state.entry.attachments.length > 0) && 
            this.renderAttachments(this.state.entry.attachments) 
          }</ul>
        </div>
    </div>;

  unfocus = () => { this.setState({ editMode: false }); }

  render = () => 
    <div>{ this.state.entry && this.state.editMode?this.renderForm():this.renderContent() }</div>;
}

export default class History extends Component {
  constructor(props) {
    super(props);
    this.entries = [];
    this.state = { 
      editingEntry: null,
      entries: [], 
      isLoading: true 
    };
  }

  componentDidMount = async () => await this.updateContent();

  beforeEdit = (event) => {
    if (this.state.editingEntry != null){
      this.entries[this.state.editingEntry].unfocus();
    }
    this.setState({ editingEntry: event.entryId });
  }

  afterEdit = (event) => {
    if (event.changed) this.updateContent();
  }

  renderEntries = (entries) => 
    [].concat(entries).map(
      (entry, i) => 
        <HistoryEntry 
          key={entry.entryId} 
          entry={entry} 
          beforeEdit={this.beforeEdit}
          afterEdit={this.afterEdit}
          ref={(he) => { this.entries[entry.entryId] = he; }} />
    );

  updateContent = async () => {
    try {
      this.setState({ isLoading: true });
      this.setState({ entries: await this.getEntries() });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });    
  }

  getEntries = () => invokeApig({ path: "/entries/list" });

  render = () => 
    <div className="History">
      <div className="history"><PageHeader>History</PageHeader></div>
      <NewHistoryEntry created={this.updateContent} />
      <div className="entries">
        { !this.state.isLoading && this.renderEntries(this.state.entries) }
      </div>
    </div>;
}
