import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './index.css';

import Welcome from './components/pages/Welcome';
import About from './components/pages/About';
import LoveLive from './components/pages/LoveLive';

import NavBar from './components/common/NavBar';

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <NavBar />
        </header>
        <div className='content'>
          <Switch>
            <Route exact path='/' component={Welcome} />
            <Route exact path='/about' component={About} />
            <Route exact path='/llsif' component={LoveLive} />

            <Route component={NoMatch}/>
          </Switch>
        </div>
      </div>
    );
  }
}

function NoMatch(){
  return (<div>No Match</div>);
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);