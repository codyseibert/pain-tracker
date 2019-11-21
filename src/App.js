import React from 'react';
import './App.css';
import Main from './Main';

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <Main />
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
