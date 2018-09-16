import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './index.css';

import Welcome from './components/pages/Welcome';
import About from './components/pages/About';
import LoveLive from './components/pages/LoveLive';
import Lost from './components/pages/Lost';

import NavBar from './components/common/NavBar';

const App = withRouter(({ location }) => (
  <div>
    <header>
      <NavBar />
    </header>
    <div className='content'>
      <TransitionGroup>
        <CSSTransition 
          key={location.key}
          classNames='fade'
          timeout={1000}
        >
          <Switch location={location}>
            <Route exact path='/' component={Welcome} />
            <Route exact path='/about' component={About} />
            <Route exact path='/llsif' component={LoveLive} />
            <Route exact path='/blue' component={BlueColour} />
            <Route exact path='/red' component={RedColour} />

            <Route component={Lost}/>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  </div>
));

function RedColour(){
  return (
    <FullColour colour="red" />
  );
}

function BlueColour(){
  return (
    <FullColour colour="blue" />
  );
}

function FullColour(props) {
  let styles = { 'backgroundColor': props.colour };
  return (
    <div className="full-colour" data={props.colour} style={styles} />
  );
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);