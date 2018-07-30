import React from 'react';
import FullImage from '../FullImage';

import './style.css';

export default function Landscape(props){
  let image = `/images/landscape/${props.index}.jpg`;

  return (
    <FullImage className="landscape" image={image} parallax={props.parallax} />
  );
}