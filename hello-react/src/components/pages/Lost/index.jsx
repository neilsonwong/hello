import React from 'react';

import FullImage from '../../common/FullImage';

import './style.css';

export default class Lost extends React.Component {
  componentDidMount(){
    document.title = '404 - Page not found';
  }
  
  render(){
    let lostImage = '/images/temp_lost.png';
    return (
      <div className="lost">
        <FullImage image={lostImage} />
        <div className="no-page">
          <h1>
            <span className="huge">404</span>
            <span>page not found</span>
          </h1>
        </div>
      </div>
    );
  }
}