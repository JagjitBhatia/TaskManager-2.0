import React, {Component} from 'react';
import {Redirect, BrowserRouter as Link } from 'react-router-dom';
import {Button} from 'react-bootstrap'

class Default extends Component {
    state = {
        redirect: "no"
    };

    constructor(props) {
        super(props);
    }

    redirectSignUp() {
        this.setState({redirect: "signup"});
    }

    redirectLogin() {
        this.setState({redirect: "login"});
    }
    render() {
        const {redirect} = this.state;  
        if(redirect == "no") {
            return (
                <div className = "App">
                     <div className="text-center" style={{marginBottom: '2rem'}}>
                  <Button onClick={()=>this.redirectSignUp()} className="btn btn-p btn-lg">
                    <p>Sign Up</p>
                  </Button>
                 </div>
                 <div className="text-center" style={{marginBottom: '2rem'}}>
                  <Button onClick={()=>this.redirectLogin()} className="btn btn-p btn-lg">
                    <p>Log In</p>
                  </Button>
                 </div>
                </div>
               
                );
        }

        else if(redirect == "signup") {
            return <Redirect to='/signup'/>;
        }

        else if(redirect == "login") {
            return <Redirect to='/login'/>;
        }
        
    }


}

export default Default;