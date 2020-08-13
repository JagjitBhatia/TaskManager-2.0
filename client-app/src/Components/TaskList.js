import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Navbar} from 'react-bootstrap'
import '../App.css';
import Task from '../Task/Task';
import axios from 'axios';
import {withRouter} from 'react-router-dom'


class TaskList extends Component {
    state = {
        tasks: []
      }


      setUser = (id) => {
        
        this.setState({user_id: id});
        axios.get(`http://localhost:8090/getTasksForUser?id=${id}`).then(response => {
          this.setState({
            tasks: response.data
          });
        });
      }
    
      removeFromList(taskToDelete) {
        let taskList = this.state.tasks;
        taskList = taskList.filter(task => task.id !== taskToDelete);
        this.setState({
          tasks: taskList
        });
      }
      
      componentDidMount() {
        let id;
        if(!this.state.id){
          if(!this.props.location.state) return;
          id = this.props.location.state.id;
          this.setState({user_id: id});
        }

        else {
          id = this.state.id;
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
        }
      
        this.removeFromList = this.removeFromList.bind(this);
        this.setUser = this.setUser.bind(this);
      }

    render() {
        const base = (
            <Container style = {{marginBottom: '4rem'}}>
               <Navbar bg = "light" className = "justify-content-md-center" fixed="top" style = {{textAlign: 'center'}}>
                <Navbar.Brand href="/" style = {{textAlign: 'center'}}><h1>Task Manager</h1></Navbar.Brand>
              </Navbar>
            </Container>
            
          );
            if(this.state.tasks.length !== 0) {
             let taskList = [];
       
             this.state.tasks.forEach((task) => {
               taskList.push(
                 <Row>
                     <Col xs={3} md={2}>
                 
                 </Col>
       
               <Col xs={12} md={8}>
                   <Task name = {task.name} description = {task.description} time = {task.time} id = {task.id} removeFromList = {this.removeFromList} callbackFromParent = {this.setUser}/>
               </Col>
               <Col xs={3} md={2}>
           
               </Col>
                 </Row>
                  
                 
               );
             });
       
             return (
             <div className="App">
               <Container>
               <div className="text-center">
               {taskList}
               </div>
               
               </Container>
              
               </div>
             );
           }
       
           else return (
             <div className="App">
               {base}
             </div>
           )
    }
}

export default withRouter(TaskList);