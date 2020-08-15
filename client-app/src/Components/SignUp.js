import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Row, Col, Navbar, Button, Form} from 'react-bootstrap'
import '../App.css';
import Task from '../Task/Task';
import axios from 'axios';
import Example from './Example';
import {NotificationManager} from 'react-notifications';
import TaskList from './TaskList';
import {Redirect, BrowserRouter as Link } from 'react-router-dom';

class SignUp extends Component {
    state = {username: "", password: "", id: -1, redirect: false};

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
            NotificationManager.success('Your account has been created', 'Sign Up Successful!');
            this.setState({redirect: true, id: response.data.id});
        }).catch(error => {
            console.log(error.response);
            if(error == 'Error: Network Error') {
                // Render error notification for 'Server Not Connected'
                NotificationManager.error('Please make sure server is running!', 'Network Error');
            }

            else {
                NotificationManager.error(error.response.data.message, 'Sign Up Error');
            }
        });
        event.preventDefault();
    }

    render() {
        const redirect = this.state.redirect;
        const user_id = this.state.id;

        if(!redirect) {
            return (
                <div className="App">
                     <form onSubmit ={this.handleSubmit} >
                    <div className="form-group">
                        <label>Username</label>
                            <input type="text" value = {this.state.username} onChange = {this.handleUsername} placeholder="Enter Username"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="text" type ="password" value = {this.state.password} onChange = {this.handlePassword} placeholder="Enter Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
               
            );
        }

        return (
            <Redirect to={{
                pathname: '/tasks',
                state: { id: user_id}
            }}
    />
        )
       
    }
}

export default SignUp;