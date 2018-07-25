import React from 'react';

import './style.css';

function RainbowText(props) {
  let words = props.value.split('');
  let spans = words.map((c, i) => (<span key={i}>{c}</span>));

  return (
    <div className='large jp row multicolour' >
      {spans}
    </div>
  );
}

function ThinBoldText(props) {
  let text = props.value;
  //default black color if not specified
  let style = {
    color: props.color || '#000000',
  };
  return (
    <div className='large en row' style={style}>{text}</div>
  );
}

export default function LoveLiveStyleDualText(props) {
  return (
    <div className="loveLiveText">
      <RainbowText value={props.jp} />
      <ThinBoldText value={props.en} color={props.color}/>
    </div>
  );
}