import React from 'react';

import './style.css';

export default function Landscape(props){
  let style = {
	'background-image': `url('/images/landscape/6.jpg'), linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.25))`,
  }
  return (
  	<div className='landscape' style={style}></div>
  );
}
