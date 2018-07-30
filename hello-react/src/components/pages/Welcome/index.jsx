import React from 'react';

import LoveLivePoster from '../../common/LoveLivePoster';
import ArrowBox from '../../common/ArrowBox';

import './style.css';

export default class LoveLive extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      scrolled: 0.1
    };

    this.handleWheel = this.handleWheel.bind(this);
  }

  componentDidMount(){
    document.title = 'Welcome';
  }

  handleWheel(event){
    let delta = event.deltaY;

    event.preventDefault();
    event.stopPropagation();

    if (delta > 0){
      this.setState(prevState => ({
        scrolled: prevState.scrolled + 0.1
      }));
    }
  }

  render(){
    let styles = {
      opacity: this.state.scrolled
    };

    return (
      <div className="welcome" onWheel={this.handleWheel} >
        <LoveLivePoster name="welcome-poster" jp="みんなさんこんにちわ" en="Hello everyone." />
        <div style={styles}>
          <ArrowBox number={3} />
        </div>
      </div>
    );
  }
}