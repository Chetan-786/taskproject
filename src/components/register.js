import React, { Component } from "react";
import { Buttons } from "./button";
import { Link } from 'react-router-dom';
import CommonService from "../services";
import toastr from 'toastr';
import constants from "../constants";

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pwd: "",
            firstname: "",
            lastname: "",
            verifypwd: "",
            localStorage: JSON.parse(localStorage.getItem(constants.LocalStorageGetAllApi)),
        }
        this.submitRegister = this.submitRegister.bind(this);
        this.inputChange = this.inputChange.bind(this);

    }
    componentDidMount() {
    }

    async submitRegister() {
        try {
            let req = {
                "method": "POST",
                "url": this.state.localStorage[constants.Register],
                "body": {
                    "firstname": this.state.firstname,
                    "lastname": this.state.lastname,
                    "username": this.state.email,
                    "password": this.state.pwd,
                    "confirmpwd": this.state.verifypwd
                }
            }
            let resp = await CommonService(req);
            if (resp && resp.isSuccess) {
                toastr.success(resp.message);
                this.props.history.push('/login')
            } else {
                toastr.error(resp.message);
            }
        } catch (error) {
            console.error(error)
        }
    }
    inputChange(e) {
        const { target: { name, value } } = e;
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
            <div className="mainWrapper">
                <div className="loginBox">
                    <div className="title">
                        <h3>Register</h3>
                    </div>
                    <div className="formBox">

                        <div className="form-group">
                            <label htmlFor="firstname">First Name:</label>
                            <input type="text" className="form-control" id="firstname" name="firstname" onChange={this.inputChange}
                                value={this.state.firstname} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Last Name:</label>
                            <input type="text" className="form-control" id="lastname" name="lastname" onChange={this.inputChange}
                                value={this.state.lastname} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email address:</label>
                            <input type="email" className="form-control" id="email" name="email" onChange={this.inputChange}
                                value={this.state.email} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="pwd" name="pwd" onChange={this.inputChange}
                                value={this.state.pwd} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pwd">Verify Password:</label>
                            <input type="password" className="form-control" id="verifypwd" name="verifypwd" onChange={this.inputChange}
                                value={this.state.verifypwd} />
                        </div>

                        <Buttons onClick={() => this.submitRegister()}>Submit</Buttons>
                    </div>
                    <div>
                        Go to <Link to='/login'>Login</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
