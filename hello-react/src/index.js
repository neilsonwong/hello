import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import Welcome from './components/Welcome';
import NavBar from './components/common/NavBar';

class Main extends React.Component {
  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <div className='content'>
          <Welcome />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);