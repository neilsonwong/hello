import React from 'react';

import FullImage from '../../common/FullImage';
import Landscape from '../../common/Landscape';
import SIFBackground from '../../common/SIFBackground';

import ParallaxDiv from '../../common/ParallaxDiv';
import ParallaxWrapper from '../../common/ParallaxWrapper';

import './style.css';

export default class Lost extends React.Component {
  componentDidMount(){
    document.title = 'About';
  }
  
  render(){
    return (
      <div className="about">
        <ParallaxWrapper>
          <Landscape parallax={true} />
            <ParallaxDiv>
              <div className="boring">boring</div>
            </ParallaxDiv>
          <SIFBackground parallax={true} />
          <MakiRoll />
        </ParallaxWrapper>
      </div>
    );
  }
}

function MakiRoll(){
  return (
    <FullImage className='makimono' image='/images/makimono.jpg' />
  );
}