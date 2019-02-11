import React, { Component } from 'react';
import Grid from './components/Grid';
import constants from './utils/constants';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Sneaky Snakes</h1>
        <Grid height={constants.GRID_HEIGHT} width={constants.GRID_WIDTH} />
      </div>
    );
  }
}

export default App;
