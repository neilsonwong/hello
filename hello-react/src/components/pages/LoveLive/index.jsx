import React from 'react';

import LoveLivePoster from '../../common/LoveLivePoster';

import './style.css';

export default class LoveLive extends React.Component {
  componentDidMount(){
    document.title = 'Love Live';
  }

  render(){
    return (<LoveLivePoster name="love-live" jp="みんなで叶えた物語" en="Thanks to you." />);
  }
}