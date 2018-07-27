import React from 'react';

import './style.css';

function RainbowText(props) {
  let words = props.value.split('');
  let spans = words.map((c, i) => (<span key={i}>{c}</span>));

  return (
    <div className="large jp row multicolour" >
      {spans}
    </div>
  );
}

function ThinBoldText(props) {
  return (
    <div className="large en row">{props.value}</div>
  );
}

export default function LoveLiveStyleDualText(props) {
  return (
    <div className="love-live-text">
      <RainbowText value={props.jp} />
      <ThinBoldText value={props.en} />
    </div>
  );
}