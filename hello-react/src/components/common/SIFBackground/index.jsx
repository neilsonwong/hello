import React from 'react';
import FullImage from '../FullImage';

import './style.css';

export default function SIFBackground(props){
  let image = `/images/llbg/${props.index}.png`;

  return (
    <FullImage className="sif-background" image={image}  parallax={props.parallax}/>
  );
}