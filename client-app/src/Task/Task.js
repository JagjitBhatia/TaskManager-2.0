//UI Component for Task object

import React, {Component} from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalTitle from 'react-bootstrap/ModalTitle';
import {withRouter} from 'react-router-dom'

import axios from 'axios';

let state = {showEdit: false};

const getMonth = (month) => {
	switch(month) {
		case 0:
			return "January";
		case 1:
			return "February";
		case 2:
			return "March";
		case 3:
			return "April";
		case 4:
			return "May";
		case 5:
			return "June";
		case 6:
			return "July";
		case 7:
			return "August";
		case 8:
			return "September";
		case 9:
			return "October";
		case 10:
			return "November";
		case 11:
			return "December";
	}
}

const getDaySuffix = (day) => {
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";

	}
}

const get12Hour = (hour) => {
	if(hour == 0 || hour == 24) return 12;

	if(hour <= 12) return 12;

	return hour - 12;
}

const getTimeSuffix = (hour) => {
	if(hour < 12 && hour < 24) return "AM"

	else return "PM";
}

const deleteTask = (taskID, removeFromList) => {
	axios.delete('http://localhost:8090/deleteTask', {
		data: {
			id: taskID
		}
	}).then(response => {
		console.log(response);
		removeFromList(taskID);
	}).catch(error => {
		console.log(error);
	})
}


class Task extends Component {
	date = new Date(this.props.time);
	state = {showEdit: false, name: "", description: "", AM: getDaySuffix(this.date.getDay()) == "AM", 
		time: {
			month: 1,
			day: 0,
			year: 0
		}};


	constructor(props) {
		super(props);
		this.updateName = this.updateName.bind(this);
		this.updateDescription = this.updateDescription.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.updateAM = this.updateAM.bind(this);
		this.updateMonth = this.updateMonth.bind(this);
		this.updateDay = this.updateDay.bind(this);
		this.updateYear = this.updateYear.bind(this);
	}


	editTask() {
		this.setState({showEdit: true});
	};
	
	closeEdit() {
		this.setState({showEdit: false});
	}

	updateName(event) {
		this.setState({name: event.target.value});
	}

	updateDescription(event) {
		this.setState({description: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.getUserID();
		this.closeEdit();
	}

	getUserID() {
		this.props.callbackFromParent(this.props.id);
	}

	updateAM(event) {
		this.setState({AM: event.target.value == "AM"});
	}

	updateMonth(event) {
		this.setState({time: {month: event.target.value, day: this.state.time.day, year: this.state.time.year}});
		console.log(this.state.time);
	}

	updateDay(event) {
		this.setState({time: {month: this.state.time.month, day: event.target.value, year: this.state.time.year}});
	}

	updateYear(event) {
		this.setState({time: {month: this.state.time.month, day: this.state.time.day, year: event.target.value}});

	}

	render() {
		const showEdit = this.state.showEdit;
		const AM = this.state.AM;


		return (
			<div>
				<Card style = {{margin:'2rem', borderRadius: '10px', textAlign: "center"}}> 
					<Card.Header style = {{textAlign: "left"}}>	
						Task ID: {this.props.id}
						<ButtonToolbar style = {{float: "right"}}>
							<Button variant = "danger" className = "fas fa-trash-alt" style = {{margin: '0.25rem'}} onClick = {() => deleteTask(this.props.id, this.props.removeFromList)}/>
							<Button variant = "primary" className = "fas fa-edit" style = {{margin: '0.25rem'}} onClick = {() => this.editTask()}/>
							<Button variant = "success" className= "fas fa-check-square" style = {{margin: '0.25rem'}}/>
						</ButtonToolbar>
					</Card.Header>
					<Card.Body>
						<Card.Title as="h4"><b>{this.props.name}</b></Card.Title>
						<Card.Text as="p">
							{this.props.description}
						</Card.Text>
						<Card.Text as="h6">
								<b>Scheduled for </b>{get12Hour(this.date.getHours())}:{this.date.getMinutes()} {getTimeSuffix(this.date.getHours())} <b>on</b> {getMonth(this.date.getMonth())} {this.date.getDay().toString() + getDaySuffix(this.date.getDay())}, {this.date.getFullYear()} 
						</Card.Text>
					</Card.Body>
				</Card>
				<Modal show={showEdit} onHide = {() => this.closeEdit()} location={this.props.location}>
      				<ModalHeader>
        				<ModalTitle><strong>Edit Task: </strong>{this.props.name}</ModalTitle>
      				</ModalHeader>
      				<ModalBody>
					  <form onSubmit ={this.handleSubmit} >
                    <div className="form-group">
                        <label>Name</label>
                            <input type="text" defaultValue = {this.props.name} onChange = {this.updateName} placeholder={this.props.name}/>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input className="text-large" type="text" type ="text" defaultValue = {this.props.description} onChange = {this.updateDescription} />
                    </div>
					<label><strong>Date</strong></label>
					<div className="form-group">
                        <label>Month</label>
                        <input className="text-small" type="text" type ="text" defaultValue = {this.date.getMonth()} onChange = {this.updateMonth} placeholder={this.props.description}/>
						<label>Day</label>
						<input className = "text-small" type="text" type ="text" defaultValue = {this.date.getDay().toString()} onChange = {this.updateDay} placeholder={this.props.description}/>
						<label>Year</label>
						<input className="text-small" type="text" type ="text" defaultValue = {this.date.getFullYear()} onChange = {this.updateYear} placeholder={this.props.description}/>
                    </div>
					<label><strong>Time</strong></label>
					<div className="form-group">
					<input className="text-small" type="text" type ="text" defaultValue = {get12Hour(this.date.getHours())} onChange = {this.updateDescription} placeholder={this.props.description}/>
					<label><strong>:</strong></label>
					<input className="text-small" type="text" type ="text" defaultValue = {this.date.getMinutes()} onChange = {this.updateDescription} placeholder={this.props.description}/>
					<input className = "form-check-input" type="radio" name = "timeofday" checked={AM == true} value="AM" onChange={this.updateAM}/>
					<label className="form-check-label"><strong>AM</strong></label>
					<input className = "form-check-input" type="radio" name = "timeofday" checked = {AM == false} value="PM" onChange={this.updateAM}></input>
					<label className="form-check-label"><strong>PM</strong></label>
					</div>
					<br></br>
                    <div className="text-center"><button type="submit" className="btn btn-primary"> Submit</button></div>
					</form>
					</ModalBody>
    			</Modal>
			</div>
		);
	}	
}

export default withRouter(Task);
