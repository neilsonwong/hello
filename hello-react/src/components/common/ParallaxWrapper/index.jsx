import React from 'react';

import './style.css';

export default function ParallaxWrapper(props) {
  return (
    <div className='parallax-wrapper'>
      {props.children}
    </div>
  );
}