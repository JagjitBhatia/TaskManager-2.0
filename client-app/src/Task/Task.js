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
import {withRouter} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';

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

	if(hour <= 12) return hour;

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

const formatNumber = function( num )
{
  if ( num < 10 )
  {
    return "0" + num;
  }
 
  return "" + num;
}

const formatYear = function(num) {
	let ret = "";

	if (num >= 1000) {
		return "" + num;
	}

	if (num >= 100) {
		return "0" + num;
	}

	if (num >= 10) {
		return "00" + num;
	}

	return "000" + num;
}



const convertToSqlDatetime = (time, AM) => {
	console.log(time);
	if(!time.month || !time.day || !time.year || !time.minutes || !time.hours) {
		console.log("CAUGHT");
		return ({datetime: "", error: true});
	}
	Object.keys(time).forEach((key) => {
		if(time[key] == undefined) return ({datetime: "", error: true})
		time[key] = parseInt(time[key]);
		let n = time[key];
		if((n - Math.floor(n)) !== 0) return ({datetime: "", error: true});
	});
	if (time.year < (new Date().getFullYear)) return ({datetime: "", error: true});
	if(time.month < 1 || time.month > 12) return ({datetime: "", error: true});
	console.log(time.day);
	if(time.day < 1 || time.day > 31) return ({datetime: "", error: true});
	if(time.hours < 0 || time.hours > 12) return ({datetime: "", error: true});

	let newtime = time;

	if(!AM) {
		if(time.hours < 12) newtime.hours += 12;
	}

	else if(time.hours == 12 || time.hours == 0) newtime.hours = 0;
	return {datetime: `${formatYear(time.year)}-${formatNumber(time.month)}-${formatNumber(time.day)} ${formatNumber(time.hours)}:${formatNumber(time.minutes)}:00`, error: false};
}

class Task extends Component {
	date = new Date(this.props.time);
	
	state = {refresh: false, prevName: this.props.name, prevDesc: this.props.description, showEdit: false, name: this.props.name, description: this.props.description, AM: getTimeSuffix(this.date.getHours()) == "AM", 
		time: {
			month: this.date.getMonth() + 1,
			day: this.date.getDate(),
			year: this.date.getFullYear(),
			hours: get12Hour(this.date.getHours()),
			minutes: this.date.getMinutes()
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
		this.updateHours = this.updateHours.bind(this);
		this.updateMinutes = this.updateMinutes.bind(this);
	}


	editTask() {
		this.setState({showEdit: true});
	};
	
	closeEdit() {
		this.setState({showEdit: false});
	}

	updateName(event) {
		this.setState({name: event.target.value, refresh: false});
	}

	updateDescription(event) {
		this.setState({description: event.target.value, refresh: false});
	}

	handleSubmit(event) {
		event.preventDefault();
		let newTime = this.state.time;
		newTime.hours = get12Hour(this.state.time.hours);
		const {datetime, error} = convertToSqlDatetime(this.state.time, this.state.AM);

		if (error) {	
			NotificationManager.error('Please enter a valid time!', 'Time Input Error');
			return;	
		}
		
		axios.put('http://localhost:8090/updateTask', {
           params: {
			   id: this.props.id,
			   name: this.state.name,
			   description: this.state.description,
			   time: datetime
           }
        }).then(response => {
			NotificationManager.success(`Task "${this.props.name}" has been successfully updated`, 'Task Updated');
		}).catch(error => {
			console.log(error);
		});

		this.setState({prevName: this.state.name, prevDesc: this.state.description});
		this.setState({refresh: true});
		this.closeEdit();
		this.date.setFullYear(this.state.time.year);
		this.date.setMonth(this.state.time.month - 1);
		this.date.setDate(this.state.time.day);
		this.date.setHours(this.state.time.hours);
		this.date.setMinutes(this.state.time.minutes); 
		this.props.callbackFromParent();

	}

	getUserID() {
		this.props.callbackFromParent(this.props.id);
	}

	getTaskName() {
		if(this.state.refresh) return this.state.name;
		
		return this.props.name;
	}

	getTaskDescription() {
		if(this.state.refresh) return this.state.description;

		return this.props.description;
	}

	updateAM(event) {
		this.setState({AM: event.target.value == "AM", refresh: false});
	}

	updateMonth(event) {
		this.setState({time: {month: event.target.value, day: this.state.time.day, year: this.state.time.year, hours: this.state.time.hours, minutes: this.state.time.minutes}, refresh: false});
	}

	updateDay(event) {
		this.setState({time: {month: this.state.time.month, day: event.target.value, year: this.state.time.year, hours: this.state.time.hours, minutes: this.state.time.minutes}, refresh: false});
	}

	updateYear(event) {
		this.setState({time: {month: this.state.time.month, day: this.state.time.day, year: event.target.value, hours: this.state.time.hours, minutes:this.state.time.minutes}, refresh: false});
	}

	updateHours(event) {
		this.setState({time: {month: this.state.time.month, day: this.state.time.day, year: this.state.time.year, hours: get12Hour(event.target.value), minutes: this.state.time.minutes}, refresh: false});
	}

	updateMinutes(event) {
		this.setState({time: {month: this.state.time.month, day: this.state.time.day, year: this.state.time.year, hours:this.state.time.hours, minutes: event.target.value}, refresh: false});
	}

	render() {
		const date = this.date;
		const showEdit = this.state.showEdit;
		const AM = this.state.AM;


		return (
			<div>
				<Card style = {{margin:'2rem', borderRadius: '10px', textAlign: "center"}}> 
					<Card.Header style = {{textAlign: "left"}}>	
						Task ID: {this.props.id}
						<ButtonToolbar style = {{float: "right"}}>
							<Button variant = "danger" className = "fas fa-trash-alt" style = {{margin: '0.25rem'}} onClick = {() => deleteTask(this.props.id, this.props.callbackFromParent)}/>
							<Button variant = "primary" className = "fas fa-edit" style = {{margin: '0.25rem'}} onClick = {() => this.editTask()}/>
							<Button variant = "success" className= "fas fa-check-square" style = {{margin: '0.25rem'}}/>
						</ButtonToolbar>
					</Card.Header>
					<Card.Body>
						<Card.Title as="h4"><b>{this.getTaskName()}</b></Card.Title>
						<Card.Text as="p">
							{this.getTaskDescription()}
						</Card.Text>
						<Card.Text as="h6">
								<b>Scheduled for </b>{get12Hour(date.getHours())}:{formatNumber(date.getMinutes())} {getTimeSuffix(date.getHours())} <b>on</b> {getMonth(date.getMonth())} {"" + date.getDate() + getDaySuffix(date.getDate())}, {date.getFullYear()} 
						</Card.Text>
					</Card.Body>
				</Card>
				<Modal show={showEdit} onHide = {() => this.closeEdit()} location={this.props.location}>
      				<ModalHeader>
        				<ModalTitle><strong>Edit Task: </strong>{this.getTaskName()}</ModalTitle>
      				</ModalHeader>
      				<ModalBody>
					  <form onSubmit ={this.handleSubmit} >
                    <div className="form-group">
                        <label>Name</label>
                            <input type="text" defaultValue = {this.getTaskName()} onChange = {this.updateName} placeholder={this.getTaskName()}/>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input className="text-large" type="text" type ="text" defaultValue = {this.getTaskDescription()} onChange = {this.updateDescription} />
                    </div>
					<label><strong>Date</strong></label>
					<div className="form-group">
                        <label>Month</label>
                        <input className="text-small" type="text" type ="text" defaultValue = {this.date.getMonth() + 1} onChange = {this.updateMonth}/>
						<label>Day</label>
						<input className = "text-small" type="text" type ="text" defaultValue = {this.date.getDate()} onChange = {this.updateDay}/>
						<label>Year</label>
						<input className="text-small" type="text" type ="text" defaultValue = {this.date.getFullYear()} onChange = {this.updateYear}/>
                    </div>
					<label><strong>Time</strong></label>
					<div className="form-group">
					<input className="text-small" type="text" type ="text" defaultValue = {get12Hour(this.date.getHours())} onChange = {this.updateHours}/>
					<label><strong>:</strong></label>
					<input className="text-small" type="text" type ="text" defaultValue = {this.date.getMinutes()} onChange = {this.updateMinutes}/>
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
export {convertToSqlDatetime, formatNumber, formatYear, get12Hour};

