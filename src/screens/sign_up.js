import React, {Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../routes';
import { compose } from 'recompose';
import 'antd/dist/antd.css';
import '../css/signup.css';
import * as ROLES from '../roles';
import { Form, Icon, Input, Button} from 'antd';
import * as firebase from "firebase";

import {withFirebase} from "../components/Firebase";

const SignUpPage = () => (
    <div className={"containsAll"}>
        <div className={"titleDiv"}>
            <h1 className={"title"}>Sign Up</h1>
        </div>
        <div className={"container"}>
            <SignupForm />
        </div>
    </div>
);

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    schoolId: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
    isTeacher: false,
};


class SignupFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }
    onChangeCheckbox = event => {
        this.setState({[event.target.name]: event.target.checked});
    };
    onSubmit = event => {
        const { firstName, lastName, schoolId, email, passwordOne, isTeacher} = this.state;
        const roles ={};
        if (isTeacher) {
            roles[ROLES.TEACHER] = ROLES.TEACHER;
        }
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne).then(authUser => {
            // Create a user in your Firebase realtime database
            return this.props.firebase
                .user(authUser.user.uid)
                .set({
                    schoolId,
                    email,
                    roles,
                });
        })
            .then(authUser => {
                const user = firebase.auth.currentUser();
                user.updateProfile({displayName: firstName + " " + lastName});
                alert(user.displayName);
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({[event.target.name]: event.target.value });
    };

    render()  {
        const {
            firstName,
            lastName,
            email,
            schoolId,
            passwordOne,
            passwordTwo,
            error,
            isTeacher,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === ' ' ||
            email === ' ';
        return (
            <div className={"center wholeDiv"}>
                <label>
                    Admin:
                    <input
                        name="isTeacher"
                        type="checkbox"
                        checked={isTeacher}
                        onChange={this.onChangeCheckbox}
                    />
                </label>
                <Form onSubmit={this.onSubmit} mode={"horizontal"} className={"signUpStyles"}>
                    <Form.Item>
                        <Input
                            name="firstName"
                            value={firstName}
                            onChange={this.onChange}
                            type="text"
                            placeholder="First Name"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="lastName"
                            value={lastName}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Last Name"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            type="email"
                            placeholder="School Email"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="schoolId"
                            value={schoolId}
                            onChange={this.onChange}
                            type="text"
                            placeholder="School Id Number"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Canvas Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Confirm Canvas Password"
                        />
                        <button disabled={isInvalid} type="submit" className={"submitButton"}>Sign Up</button>
                        {error && <p>{error.message}</p>}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
const SignupForm = compose(
    withRouter,
    withFirebase,
)(SignupFormBase);

export default SignUpPage;

export {SignupForm};