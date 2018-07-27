import React from 'react';

import LoveLivePoster from '../../common/LoveLivePoster';
import About from '../About';

import './style.css';

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      scrolled: 0
    };

    this.handleWheel = this.handleWheel.bind(this);
  }

  componentDidMount() {
    document.title = 'Welcome';
  }

  handleWheel(event){
    let delta = event.deltaY;

    event.preventDefault();
    event.stopPropagation();

    console.log(delta);

    // if (event.deltaY > 0){
      this.setState(prevState => ({
        scrolled: prevState.scrolled + delta
      }));
    // }
  }

  render(){
    let styles = {
      transform: `translateY(${-1 * (this.state.scrolled)}px)`
    };

    return (
      <div name="index" onWheel={this.handleWheel}>
        <div name="Welcome" style={styles} >
          <LoveLivePoster name="welcome" jp="みんなさんこんにちわ" en="Hello everyone." />
          <ArrowBox number={3} />
        </div>
        <About />
      </div>
    );
  }
}

function ArrowBox(props){
  let arrows = new Array(props.number).map(() => (
    <div style={props.style}>
      <div className="arrow-down bounce"></div>
    </div>
  ));

  return (
    <div className="arrow-box">
      {arrows}
    </div>
  );
}