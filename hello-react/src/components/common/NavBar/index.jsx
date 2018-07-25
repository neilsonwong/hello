import React from 'react';

import './style.css';

//responsibility of what is in nav bar is the nav bar component
import * as navItems from './nav.json';


export default class NavBar extends React.Component {
  constructor(){
    super();
    // this.state.autohide = false;
    this.items = navItems;
  }

  render() {
    let links = this.items.map((item, index) => {
      return (<NavLink href={item.href} text={item.text} key={index}/>);
    });
    return (
      <nav className='nav'>
        <ul>
          {links}
        </ul>
      </nav>
    );
  }
}

function NavLink(props) {
  return (
    <li>
      <a href={props.href}>{props.text}</a>
    </li>
  );
}