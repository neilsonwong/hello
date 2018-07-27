import React from 'react';

import './style.css';

export default function FullImage(props){
 let style = {
    'backgroundImage': `url('${props.image}'), linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.25))`,
  };

  //big difference between parallax and non parallax case
  if (!props.parallax) {
    return (
      <div className="full-image" style={style}></div>
    );
  }
  else {
    return (
      <div className="full-image parallax-img">
        <div className="full-image parallax-img parallax-moving-img" style={style}/>
      </div>
    );
  }
}
