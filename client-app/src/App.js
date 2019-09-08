import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col} from 'react-bootstrap'
import './App.css';
import Task from './Task/Task'
import axios from 'axios';

class App extends Component {
  state = {
    tasks: []
  }


  componentDidMount() {
    axios.get('http://localhost:8090/getAllTasks').then(response => {
      this.setState({
        tasks: response.data
      });
      console.log("Fetched: " + JSON.stringify(response.data));
    }).catch(error => {
        console.log(error);
    });
    
  }

  render() {
    const base = (
      <div>
        <h1>Task Manager</h1>
      </div>
    );

  

    if(this.state.tasks.length !== 0) {
      let taskList = [];

      this.state.tasks.forEach((task) => {
        taskList.push(
          <Row>
              <Col xs={3} md={2}>
          
          </Col>

        <Col xs={12} md={8}>
            <Task name = {task.name} description = {task.description} time = {task.time} id = {task.id}/>
        </Col>
        <Col xs={3} md={2}>
    
        </Col>
          </Row>
           
          
        );
      });

      return (
      <div className="App">
        <Container>
        {base}
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

export default App;
