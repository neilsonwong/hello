import React from 'react';

import LoveLiveStyleDualText from '../common/loveLiveStyleDualText';
import Kotobomb from '../common/kotobomb';

import './style.css';

export default class Welcome extends React.Component {
  render() {
    return (
      <div className="welcome">
        <LoveLiveStyleDualText jp='みんなさんこんにちわ' en='Hello everyone.' color='white'/>
        <Kotobomb />
      </div>
    );
  }
}