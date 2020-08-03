import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Navbar, Button, Form} from 'react-bootstrap'
import '../App.css';
import Task from '../Task/Task';
import axios from 'axios';

class SignUp extends Component {
    state = {username: "", password: ""};

    constructor(props) {
        super(props);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsername(event) {
        this.setState({username: event.target.value});
    }   

    handlePassword(event) {
        this.setState({password: event.target.value});
    }
    handleSubmit(event) {
       axios.post('http://localhost:8090/createUser', {
           params: {
               username: this.state.username,
               password: this.state.password
           }
        }).then(response => {
            console.log("RESPONSE: ", response);
        }).catch(error => {
            console.log(error);
        });
        event.preventDefault();
    }

    render() {
        return (
            <div className="App">
                 <form onSubmit ={this.handleSubmit} >
                <div className="form-group">
                    <label>Username</label>
                        <input type="text" value = {this.state.username} onChange = {this.handleUsername} placeholder="Enter Username"/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="text" value = {this.state.password} onChange = {this.handlePassword} placeholder="Enter Password"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
           
        );
    }
}

export default SignUp;