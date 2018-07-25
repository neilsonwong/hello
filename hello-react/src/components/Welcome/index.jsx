import React from 'react';

import LoveLiveStyleDualText from '../common/LoveLiveStyleDualText';
import Kotobomb from '../common/Kotobomb';

import './style.css';

export default class Welcome extends React.Component {
  render() {
    return (
      <div className='welcome'>
        <LoveLiveStyleDualText jp='みんなさんこんにちわ' en='Hello everyone.' color='white'/>
        <Kotobomb />
      </div>
    );
  }
}