import React from 'react';
import { Redirect } from 'react-router-dom';

import LoveLivePoster from '../../common/LoveLivePoster';

import './style.css';

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      distance: 0.1,
      opacity: 0.1,
      rotation: 0
    };
  }

  componentDidMount() {
    document.title = 'Welcome';
    this.scrollListener = this.handleScroll.bind(this);
    document.addEventListener("mousewheel", this.scrollListener);
  }

  componentWillUnmount() {
    this.cleanUp();
  }

  cleanUp(){
    if (this.scrollListener){
      document.removeEventListener("mousewheel", this.scrollListener);
      this.scrollListener = null;
    }
  }

  handleScroll(e){
    //native js event handler !!!
    e.preventDefault();
    e.stopPropagation();

    if (e.deltaY > 0){
      if (this.state.distance <= 1){
        this.setState(prevState => ({
          distance: prevState.distance + 0.1,
          opacity: Math.min(1, prevState.opacity + 0.1),
        }));
      }
      else if (this.state.distance <= 2.1){
        this.setState(prevState => ({
          distance: prevState.distance + 0.1,
          rotation: Math.min(180, prevState.rotation + 18),
        }));
      }
      else if (!this.state.fireworks) {
        this.setState(prevState => ({
          fireworks: true
        }));
      }
    }
  }

  fireworks(){
    //fire the fireworks

    //redirect the page
  }

  render(){
    //redirect to about page
    if (this.state.fireworks <= 0) {
      let aboutPath = { pathname: '/about' };
      this.cleanUp();
      return (
        <Redirect to={aboutPath} />
      );
    }

    let styles = {
      opacity: this.state.opacity,
      transform: `rotate(${this.state.rotation}deg)`,
    };

    return (
      <div>
        <LoveLivePoster name="welcome" jp="みんなさんこんにちわ" en="Hello everyone." />
        <div className="arrow-box" >
          <div style={styles}>
            <div className="arrow-down bounce"></div>
          </div>
          <div style={styles}>
            <div className="arrow-down bounce"></div>
          </div>
          <div style={styles}>
            <div className="arrow-down bounce"></div>
          </div>
        </div>
      </div>
    );
  }
}