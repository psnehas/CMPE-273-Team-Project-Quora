import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import Navbar from './components/NavBar/Navbar'
//App Component
class App extends Component {
  render() {
    return (
      //Use Browser Router to route to different pages
      <BrowserRouter>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
      </BrowserRouter>
    );
  }
}
//Export the App component so that it can be used in index.js
export default App;