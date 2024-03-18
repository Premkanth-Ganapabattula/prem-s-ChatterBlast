import React, { Component } from 'react';
import axios from 'axios';

class TranslatorComponent extends Component {
  state = {
    inputText: '',
    translatedText: '',
    sourceLanguage: ''
  };

  translateText = async () => {
    try {
      const response = await axios.post('http://localhost:5000/translate', {
        inputText: this.state.inputText
      });
      const { translatedText, sourceLanguage } = response.data;
      this.setState({ translatedText, sourceLanguage });
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.inputText}
          onChange={(e) => this.setState({ inputText: e.target.value })}
        />
        <button onClick={this.translateText}>Translate</button>
        <div>
          <p>Source Language: {this.state.sourceLanguage}</p>
          <p>Translated Text: {this.state.translatedText}</p>
        </div>
      </div>
    );
  }
}

export default TranslatorComponent;
