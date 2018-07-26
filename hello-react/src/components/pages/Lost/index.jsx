import React from 'react';

import FullImage from '../../common/FullImage';

import './style.css';

export default function Lost(props) {
  let lostImage = '/images/temp_lost.png';
  return (
  	<div className='lost'>
	  <FullImage image={lostImage} />
	  <div className='noPage'>
	    <h1>
	      <span className='huge'>404</span>
	      <span>page not found</span>
	    </h1>
	  </div>
	</div>
  );
}