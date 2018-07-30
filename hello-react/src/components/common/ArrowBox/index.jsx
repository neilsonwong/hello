import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';

export default function ArrowBox(props){
  let arrows = [];
  for (let i = 0; i < props.number; ++i){
    arrows.push((<Link className="arrow-down bounce" to="/about" key={'arrow' + i}/>));
  }

  return (
    <div className="arrow-box">
      {arrows}
    </div>
  );
}