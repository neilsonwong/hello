import React from 'react';

import LoveLiveStyleDualText from '../LoveLiveStyleDualText';
import Kotobomb from '../Kotobomb';

import './style.css';

export default function LoveLivePoster(props) {
  return (
    <div className={props.name + ' loveLivePoster'}>
      <LoveLiveStyleDualText jp={props.jp} en={props.en} />
      <Kotobomb />
    </div>
  );
}