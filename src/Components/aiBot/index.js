import React, { Component } from 'react';
import Cookies from 'js-cookie';

class AiBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      response: ''
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const jwtToken = Cookies.get('jwt_token')
    const {message} = this.state
    const requestBody = {
        message: message
    }
    const url = `http://localhost:8080/ai/bot/`
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` 
          },
        body: JSON.stringify(requestBody)
    }
    const mresponse = await fetch(url, options)
    const data = await mresponse.json()
    console.log(data.response)
    this.setState({response: data.response, message: ''})
  };

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
  };

  render() {
    const { message, response } = this.state;
    return (
      <div>
        <h1>Chat with the Bot</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={this.handleMessageChange}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
        {response && (
          <div>
            <p><strong>Bot:</strong> {response.content}</p>
          </div>
        )}
      </div>
    );
  }
}

export default AiBot;
