import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Navbar} from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalTitle from 'react-bootstrap/ModalTitle';
import '../App.css';
import Task, {convertToSqlDatetime, formatNumber, formatYear, get12Hour} from '../Task/Task';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import {withRouter} from 'react-router-dom';
import socketIOClient from 'socket.io-client';


class TaskList extends Component {
    state = {
        refresh: true,
        tasks: [], 
        showAdd: false, name: "", description: "", AM: true, 
		time: {
			month: 0,
			day: 0,
			year: 0,
			hours: 0,
			minutes: 0
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
        this.handleSockNotif = this.handleSockNotif.bind(this);
      }



      shouldComponentUpdate() {
          return this.state.refresh;
      }

      handleSockNotif(message) {
        message.forEach((task) => {NotificationManager.warning(`It's time for task "${task.name}"!`,'Task Alert', 5000);})
        this.state.notifServer.emit('tasksReceived', {});
      }
      
      setUser = (id) => {
        console.log("I was called");
          this.setState({user_id: id});
        axios.get(`http://localhost:8090/getTasksForUser?id=${id}`).then(response => {
          this.setState({
            tasks: response.data
          });
          console.log("FETCHED NEW: ", this.state.tasks);
        });
        
      }
    
      removeFromList(taskToDelete) {
        let taskList = this.state.tasks;
        taskList = taskList.filter(task => task.id !== taskToDelete);
        this.setState({
          tasks: taskList
        });

        this.refreshTaskList();
      }
      
      refreshTaskList() {
        this.componentDidMount();
      }

      componentDidMount() {
        if(this.state.refresh) {
          let id;
        if(!this.state.user_id){
          if(!this.props.location.state) return;
          id = this.props.location.state.id;
          this.setState({user_id: id});
        }

        else {
          id = this.state.user_id;
        }
        
        console.log("ID: ", id);
        if(id) {
          axios.get(`http://localhost:8090/getTasksForUser?id=${id}`).then(response => {
            console.log("RESPONSE: ", response.data);
            this.setState({
              tasks: response.data
            });
          }).catch(error => {
              console.log(error);
          });  

          console.log("attempting connection");
          const socket = socketIOClient('http://localhost:8020/');
          this.setState({notifServer: socket});
          socket.on('id_request', () => {socket.emit('subscribed', this.state.user_id)});
          socket.on('taskNotif', this.handleSockNotif);
        }
        }
        
      
        this.removeFromList = this.removeFromList.bind(this);
        this.setUser = this.setUser.bind(this);
        this.refreshTaskList = this.refreshTaskList.bind(this);

        
      }

      updateName(event) {
        this.setState({name: event.target.value, refresh: false});
      }
    
      updateDescription(event) {
        this.setState({description: event.target.value, refresh: false});
      }

      getTaskDescription() {
        if(this.state.refresh) return this.state.description;
    
        return this.state.prevDesc;
      }


      updateAM(event) {
        this.setState({AM: event.target.value == "AM"});
        this.forceUpdate();
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

      closeAdd() {
        this.setState({refresh: true, showAdd: false});
        this.forceUpdate();
      }

      openAdd() {
        this.setState({showAdd: true});
      }

      handleSubmit() {
        event.preventDefault();
        console.log(this.state.user_id);
		    let newTime = this.state.time;
		    newTime.hours = get12Hour(this.state.time.hours);
		    const {datetime, error} = convertToSqlDatetime(this.state.time, this.state.AM);

		    if (error) {	
			    NotificationManager.error('Please enter a valid time!', 'Time Input Error');
			    return;	
	    	}
		
		    axios.post('http://localhost:8090/createTask', {
           params: {
			      id: this.state.user_id,
			      name: this.state.name,
			      description: this.state.description,
			      time: datetime
           }
        }).then(response => {
			    NotificationManager.success(`Task "${this.state.name}" has been successfully created!`, 'Task Created');
		    }).catch(error => {
			    console.log(error);
		    });

		    this.setState({prevName: this.state.name, prevDesc: this.state.description});
        this.setState({refresh: true});
        this.closeAdd();
        this.forceUpdate();
      }

    render() {

      const stateTasks = this.state.tasks;

        const base = (
            <Container style = {{marginBottom: '2rem'}}>
               <Navbar bg = "light" className = "justify-content-md-center" fixed="top" style = {{textAlign: 'center'}}>
                <Navbar.Brand href="/" style = {{textAlign: 'center'}}><h1>Task Manager</h1></Navbar.Brand>
              </Navbar>
            </Container>
             
            
          );

          const showAdd = this.state.showAdd;
          const AM = this.state.AM;

          const AddModal = (
            <Modal show={showAdd} onHide = {() => this.closeAdd()} location={this.props.location}>
      				<ModalHeader>
        				<ModalTitle><strong>Add New Task</strong></ModalTitle>
      				</ModalHeader>
      				<ModalBody>
					  <form onSubmit ={this.handleSubmit} >
                    <div className="form-group">
                        <label>Name</label>
                            <input type="text" onChange = {this.updateName} placeholder="Name this task"/>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input className="text-large" type="text" type ="text" onChange = {this.updateDescription} placeholder="Describe this task"/>
                    </div>
					<label><strong>Date</strong></label>
					<div className="form-group">
                        <label>Month</label>
                        <input className="text-small" type="text" type ="text" onChange = {this.updateMonth}/>
						<label>Day</label>
						<input className = "text-small" type="text" type ="text"  onChange = {this.updateDay}/>
						<label>Year</label>
						<input className="text-small" type="text" type ="text" onChange = {this.updateYear}/>
                    </div>
					<label><strong>Time</strong></label>
					<div className="form-group">
					<input className="text-small" type="text" type ="text" onChange = {this.updateHours}/>
					<label><strong>:</strong></label>
					<input className="text-small" type="text" type ="text" onChange = {this.updateMinutes}/>
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
          );

            if(stateTasks !== 0) {
             let taskList = [];
             console.log(stateTasks);
             stateTasks.forEach((task) => {
               taskList.push(
                 <Row>
                     <Col xs={3} md={2}>
                 
                 </Col>
       
               <Col xs={12} md={8}>
                   <Task name = {task.name} description = {task.description} time = {task.time} id = {task.id} removeFromList = {this.removeFromList} callbackFromParent = {this.refreshTaskList} user_id = {this.state.user_id}/>
               </Col>
               <Col xs={3} md={2}>
           
               </Col>
                 </Row>
                  
                 
               );
             });
       
             return (
             <div className="App">
               <Container>
               <Button variant = "info" className= "fas fa-plus button-md" style={{marginTop: 20, marginLeft: 680}} onClick = {() => this.openAdd()} />
               <div className="text-center">
               {taskList}
               </div>
               
               </Container>
               {AddModal}
               </div>
             );
           }
           
           else return (
             <div className="App">
               {base}
               <Button variant = "info" className= "fas fa-plus button-md" style={{marginTop: 20, marginLeft: 580}} onClick = {() => this.openAdd()}/>
               {AddModal}
             </div>
           )
    }
}

export default withRouter(TaskList);