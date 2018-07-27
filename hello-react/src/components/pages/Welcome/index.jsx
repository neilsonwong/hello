import React from 'react';

import LoveLivePoster from '../../common/LoveLivePoster';

import './style.css';

export default class Welcome extends React.Component {
  componentDidMount(){
    document.title = 'Welcome';
  }

  render(){
    return (<LoveLivePoster name="welcome" jp="みんなさんこんにちわ" en="Hello everyone." />);
  }
}