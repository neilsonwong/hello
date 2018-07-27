import React from 'react';
import FullImage from '../FullImage';

import './style.css';

export default function SIFBackground(props){
  let image = '/images/llbg/' + Math.floor(Math.random() * (25)) + '.png';

  return (
    <FullImage className="sif-background" image={image}  parallax={props.parallax}/>
  );
}