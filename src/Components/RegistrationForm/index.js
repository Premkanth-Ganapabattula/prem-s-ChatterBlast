import {Component} from 'react';
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie';
import ReactLoaderSpinner from '../reactSpinner';

import './index.css'

class RegistrationForm extends Component {
    state = {
        firstName: "",
        lastName: "",
        emailId: "",
        phoneNumber: "",
        dateOfBirth: "",
        password: "",
        gender: "Male",
        errorMsg: "",
        redirect: false,
        loadingSingupButton: false
    }

    registrationSuccess = (jwtToken, id) => {
        Cookies.set('jwt_token', jwtToken, {
        expires: 1,
        path: '/',
        })
        Cookies.set('user_id', id,{
            expires: 1,
            path: '/',
        })
        this.setState({redirect: true, loadingSingupButton: false})        
    }

    onSubmitRegistrationForm = async event => {
        event.preventDefault()
        this.setState({loadingSingupButton: true})
        const {
            firstName,
            lastName,
            emailId,
            phoneNumber,
            dateOfBirth,
            password,
            gender
        } = this.state

        const userDetails = {
            firstName,
            lastName,
            emailId,
            phoneNumber,
            dateOfBirth,
            password,
            gender
        }

        const url = "https://chatterblast-server.onrender.com/registration/"
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(userDetails)
        } 

        const response = await fetch(url, options)
        const data = await response.json()
        if (response.status === 400){
            this.setState({errorMsg: data.error, loadingSingupButton: false})
        }else if (response.status === 200) {
            this.setState({errorMsg: ""})
            this.registrationSuccess(data.jwtToken, data.id)
        }
        
    }

    onChangeFirstNameElement = event => {
        this.setState({firstName: event.target.value})
    }

    onChangeLastNameElement = event => {
        this.setState({lastName: event.target.value})
    }

    onChangeEmailElement = event => {
        this.setState({emailId: event.target.value})
    }

    onChangePhoneNumberElement = event => {
        this.setState({phoneNumber: event.target.value})
    }

    onChangePasswordElement = event => {
        this.setState({password: event.target.value})
    }

    onChangeDateOfBirthElement = event => {
        this.setState({dateOfBirth: event.target.value})
    }

    onChangeGenderElement = event => {
        this.setState({gender: event.target.value})
    }

    renderFirstNameField = () => {
        const {firstName} = this.state

        return(
            <div className="render-container">
                <label className='label-names' htmlFor='firstNameEle'>FirstName</label>
                <br />
                <input
                  type='text'
                  value={firstName}
                  id="firstNameEle"
                  placeholder='First Name'
                  className='input-element-f-l'
                  autoComplete='off'
                  onChange={this.onChangeFirstNameElement}
                  required
                />
            </div>
        )
    }

    renderLastNameField = () => {
        const {lastName} = this.state

        return(
            <div className="render-container">
                <label className='label-names' htmlFor='lastNameEle'>LastName</label>
                <br />
                <input
                  type='text'
                  value={lastName}
                  id="lastNameEle"
                  placeholder='Last Name'
                  className="input-element-f-l"
                  autoComplete='off'
                  onChange={this.onChangeLastNameElement}
                  required
                />
            </div>
        )
    }

    renderEmailFeild() {
        const {emailId} = this.state
        return (
            <div>
                <label className='label-names' htmlFor='emailEle'>Email</label>
                <br />
                <input
                  type='text'
                  value={emailId}
                  id="emailEle" 
                  placeholder='Email' 
                  className="input-element"
                  autoComplete='off'
                  onChange={this.onChangeEmailElement}
                  required
                />
            </div>
        )
    }

    renderPhoneNumberFeild() {
        const {phoneNumber} = this.state
        return (
            <div>
                <label className='label-names' htmlFor='phoneNumberEle'>Mobile</label>
                <br />
                <input
                  type='text'
                  value={phoneNumber}
                  id="phoneNumberEle"
                  placeholder='Mobile Number' 
                  className="input-element"
                  autoComplete='off'
                  onChange={this.onChangePhoneNumberElement}
                  required
                />
            </div>
        )
    }

    renderPasswordFeild() {
        const {password} = this.state
        return (
            <div>
                <label className='label-names' htmlFor='passwordEle'>Password</label>
                <br />
                <input
                  type='password'
                  value={password} 
                  id='passwordEle' 
                  placeholder='Password' 
                  className='input-element'
                  autoComplete='off'
                  onChange={this.onChangePasswordElement}
                  required
                />
            </div>
        )
    }

    renderDateOfBirthFeild() {
        const {dateOfBirth} = this.state
        return (
            <div>
                <label className='label-names' htmlFor='dateOfBirthEle'>Date Of Birth</label>
                <br />
                <input
                  type='date' 
                  value={dateOfBirth} 
                  id='dateOfBirthEle' 
                  className='input-element-f-l'
                  autoComplete='off'
                  onChange={this.onChangeDateOfBirthElement} 
                  required
                />
            </div>
        )
    }

    renderGenderFeild() {
        const {gender} = this.state
        return (
            <div>
                <label className='label-names' htmlFor='genderEle'>Gender</label>
                <br />
                <select id="genderEle" value={gender} autoComplete='off' className='select-element' onChange={this.onChangeGenderElement} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Custom">Custom</option>
                </select>
            </div>
        )
    }

    render() {
        const {errorMsg, redirect, loadingSingupButton} = this.state;
        if (redirect) {
            return <Redirect to="/user/profile/setup" />
        }
        return (
            <div className="registration-form-container">
                <h1 className="chatterblast-heading">ChatterBlast</h1>
                <form className='form-container-res' onSubmit={this.onSubmitRegistrationForm}>
                    <h2 className="create-account-text">Create a new account</h2>
                    <div className='fristname-lastname'>
                        <div className="input-element-container">
                            {this.renderFirstNameField()}
                        </div>
                        <div className="input-element-container">
                            {this.renderLastNameField()}
                        </div>
                    </div>
                    <div className="input-element-container">
                        {this.renderEmailFeild()}
                    </div>
                    <div className="input-element-container">
                        {this.renderPhoneNumberFeild()}
                    </div>
                    <div className="input-element-container">
                        {this.renderPasswordFeild()}
                    </div>
                    <div className='fristname-lastname'>
                        <div className="input-element-container">
                            {this.renderDateOfBirthFeild()}
                        </div>
                        <div className="input-element-container">
                            {this.renderGenderFeild()}
                        </div>
                    </div>
                    <div className='signup-button-container'>
                        <button type='submit' className='signup-button'>{
                            loadingSingupButton? <ReactLoaderSpinner /> : 'SignUp'
                        }</button>
                        <p className='error-msg'>{errorMsg}</p>
                        <Link to="/login" className='have-account-text'>Already have a account</Link>
                    </div>
                </form>
            </div>
        )
    }
}

export default RegistrationForm
