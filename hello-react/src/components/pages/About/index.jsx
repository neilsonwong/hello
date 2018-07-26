import React from 'react';

import FullImage from '../../common/FullImage';
import Landscape from '../../common/Landscape';
import SIFBackground from '../../common/SIFBackground';

import './style.css';

export default function About(props) {
  return (
    <div className='about'>
      <Landscape />
      <SIFBackground />
      <MakiRoll />
    </div>
  );
}

function MakiRoll(){
  return (
  	<FullImage className='makimono' image='/images/makimono.jpg' />
  );
}