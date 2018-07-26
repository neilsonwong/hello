import React from 'react';

import './style.css';

export default function Landscape(props){
  let style = {
	'background-image': `url('${props.image}'), linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.25))`,
  }
  return (
  	<div className='full-image' style={style}></div>
  );
}
