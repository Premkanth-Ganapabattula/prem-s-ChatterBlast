import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import ReactLoaderSpinner from '../reactSpinner'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    loadingLoginButton: false
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = (jwtToken, id) => {
    const {history} = this.props
    this.setState({loadingLoginButton: false})
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    Cookies.set('user_id', id, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg, loadingLoginButton: false})
  }

  submitForm = async event => {
    event.preventDefault()
    this.setState({loadingLoginButton: true})
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://chatterblast-server.onrender.com/login'
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwtToken, data.id)
    } else {
      this.onSubmitFailure(data.error)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          autoComplete='off'
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          autoComplete='Username'
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg, loadingLoginButton} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <div>
          <h1 className="logo-heading">Welcome to <span className='chatterblast-name'>ChatterBlast</span></h1>
          <p className="slogan-msg">Your World, Your Network</p>
        </div>
        <form className="form-container" onSubmit={this.submitForm}>
          <h2 className='login-form-heading'>Login to ChatterBlast</h2>
          <div className="input-container-login">{this.renderUsernameField()}</div>
          <div className="input-container-login">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            {loadingLoginButton? <ReactLoaderSpinner /> : 'Login'}
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <div className="forgot-signup">
            <Link to="" className='singup-button'>Forgotten account</Link>
            <Link to="/registration" className='singup-button'>Sign up for ChatterBlast</Link>
          </div>
        </form>
      </div>
    )
  }
}

export default LoginForm
