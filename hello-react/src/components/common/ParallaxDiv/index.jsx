import React from 'react';

import './style.css';

export default function ParallaxDiv(props){
  return (
    <div className="parallax-div">
      {props.children}
    </div>
  );
}
