import React from 'react';

import FullImage from '../../common/FullImage';
import Landscape from '../../common/Landscape';
import SIFBackground from '../../common/SIFBackground';

import ParallaxDiv from '../../common/ParallaxDiv';
import ParallaxWrapper from '../../common/ParallaxWrapper';

import './style.css';

export default class Lost extends React.Component {
  constructor(props){
    super(props);
    this.landscapeIndex = Math.floor(Math.random() * (8));
    this.llbgIndex = Math.floor(Math.random() * (25));
  }

  componentDidMount(){
    document.title = 'About';
  }
  
  render(){
    return (
      <div className="about">
        <Landscape index={this.landscapeIndex} />
        <SIFBackground index={this.llbgIndex} />
        <MakiRoll />
      </div>
    );
  }
}

function MakiRoll(){
  return (
    <FullImage className='makimono' image='/images/makimono.jpg' />
  );
}