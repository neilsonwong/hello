import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './index.css';

import Welcome from './components/pages/Welcome';
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
            <Route path='/ll' component={LoveLive} />

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