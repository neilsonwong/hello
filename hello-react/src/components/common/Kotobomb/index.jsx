import React from 'react';

import './style.css';

export default class Kotobomb extends React.Component {
  render() {
    let onItemClick = chunchun;
    return (
      <div className="kotobomb hiding">
        <img src="images/kotobomb.png" alt="kotori photobomb" onClick={onItemClick} />
      </div>
    );
  }
}

function chunchun() {
    new Audio('/sounds/chunchun.mp3').play();
}