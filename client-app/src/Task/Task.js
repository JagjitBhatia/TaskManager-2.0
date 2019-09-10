//UI Component for Task object

import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import axios from 'axios';

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

const task = (props) => {
	let date = new Date(props.time);
	return (
		<div>
			<Card style = {{margin:'2rem', borderRadius: '10px', textAlign: "center"}}> 
				<Card.Header style = {{textAlign: "left"}}>	
					Task ID: {props.id}
					<ButtonToolbar style = {{float: "right"}}>
						<Button variant = "danger" className = "fas fa-trash-alt" style = {{margin: '0.25rem'}} onClick = {() => deleteTask(props.id, props.removeFromList)}/>
						<Button variant = "primary" className = "fas fa-edit" style = {{margin: '0.25rem'}}/>
						<Button variant = "success" className= "fas fa-check-square" style = {{margin: '0.25rem'}}/>
					</ButtonToolbar>
				</Card.Header>
				<Card.Body>
					<Card.Title as="h4"><b>{props.name}</b></Card.Title>
					<Card.Text as="p">
						{props.description}
					</Card.Text>

					<Card.Text as="h6">
						<b>Scheduled for </b>{get12Hour(date.getHours())}:{date.getMinutes()} {getTimeSuffix(date.getHours())} <b>on</b> {getMonth(date.getMonth())} {date.getDay().toString() + getDaySuffix(date.getDay())}, {date.getFullYear()} 
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
		
	);
}

export default task;
