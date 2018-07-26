import React from 'react';
import FullImage from '../FullImage';

import './style.css';

export default function Landscape(props){
  let image = '/images/landscape/' + Math.floor(Math.random() * (8)) + '.jpg';

  return (
  	<FullImage className='landscape' image={image} />
  );
}