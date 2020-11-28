import React, { Component } from "react";
import { Buttons } from "./button";
import { Link } from 'react-router-dom';
// import { withRouter } from 'react-router-dom'
import toastr from 'toastr';
import CommonService from "../services";
import constants from '../constants'

class Login extends Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            email: "",
            pwd: "",
            localStorage: JSON.parse(localStorage.getItem(constants.LocalStorageGetAllApi))
        }
        this.submitLogin = this.submitLogin.bind(this);
        this.inputChange = this.inputChange.bind(this);

    }
    componentDidMount() {
        if (sessionStorage.getItem(constants.sessionStorageUserDetails)) {
            sessionStorage.removeItem(constants.sessionStorageUserDetails)
        }
    }

    async submitLogin() {
        try {
            if (!(this.state.email && this.state.pwd)) {
                toastr.error("Username and Password is required")
                return;
            }
            let data = {
                "method": "POST",
                "url": this.state.localStorage[constants.Login],
                "body": { username: this.state.email, password: this.state.pwd }
            }
            let resp = await CommonService(data);
            if (resp && resp.isSuccess) {
                toastr.success(resp);
                sessionStorage.setItem(constants.sessionStorageUserDetails, resp);
                this.props.history.push('/notes')
            } else {
                toastr.error(resp.message);
            }
        } catch (error) {
            console.error(error)
        }

    }
    inputChange(e) {
        const { target: { name, value } } = e
        this.setState({
            [name]: value,
        })
    }
    render() {
        return (
            <div className="mainWrapper">
                <div className="loginBox">
                    <div className="title">
                        <h2>Login</h2>
                    </div>
                    <div className="formBox">
                        <div className="form-group">
                            <label className="lblBlack" htmlFor="email">Email address:</label>
                            <input type="email" className="form-control" id="email" name="email" onChange={this.inputChange}
                                value={this.state.email} />
                        </div>
                        <div className="form-group">
                            <label className="lblBlack" htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwd" name="pwd" onChange={this.inputChange}
                                value={this.state.pwd} />
                        </div>
                        <div className="formBtn">
                            <Buttons onClick={() => this.submitLogin()}>Login</Buttons>
                        </div>
                        <div>
                            Not Registered yet? <Link to='/register'>Sign in</Link>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Login;
