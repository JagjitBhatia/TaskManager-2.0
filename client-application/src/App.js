import React, { Component } from 'react';
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
        <h3>Welcome to the Ultimate Task Manager!</h3>
      </div>
    );

    if(this.state.tasks.length !== 0) {
      let taskList = [];

      this.state.tasks.forEach((task) => {
        taskList.push(<Task name = {task.name} description = {task.description} time = {task.time}/>)
      });

      return (
      <div className="App">
        {base}
        {taskList}
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
