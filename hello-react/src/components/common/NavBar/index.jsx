import React from 'react';
import { NavLink } from 'react-router-dom';

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
      return (<NavItem href={item.href} text={item.text} key={index} />);
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

function NavItem(props) {
  return (
    <li>
      <NavLink to={props.href} exact={true}>{props.text}</NavLink>
    </li>
  );
}