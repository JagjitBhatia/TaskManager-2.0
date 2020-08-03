import React, { Component } from 'react';
import TaskList from './Components/TaskList';
import SignUp from './Components/SignUp';
import Default from './Components/Default';
import Container from 'react-bootstrap/Container';
import {Row, Col, Navbar, Button} from 'react-bootstrap'
import './App.css';
import Task from './Task/Task';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


class App extends Component {

  render() {
    return (
      <Router>
           
        <div>
            <Container style = {{marginBottom: '10rem'}}>
               <Navbar bg = "light" className = "justify-content-md-center" fixed="top" style = {{textAlign: 'center'}}>
                <Navbar.Brand href="/" style = {{textAlign: 'center'}}><h1>Task Manager</h1></Navbar.Brand>
              </Navbar>
            </Container>
            
            <Switch>
            <Route exact path ="/" component = {Default}/>
            <Route exact path ="/signup" component = {SignUp}/>
           { //<Route exact path = "/login" component = {Login}/>
            }   
            <Route exact path="/tasks" component = {TaskList}/>
          </Switch>
        </div>

      </Router>
   
        
      
    );

  

   
  }
}

export default App;


