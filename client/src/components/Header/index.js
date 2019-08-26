import React, { Component } from 'react';

import './Header.css';
import logo from '../../assets/images/logo.png';

export default class Header extends Component {
    constructor(props)
    {
        super();
    }
    render() {
        return (
            <div className="header">
                <a href="/" ><img alt="logo" src={logo} /></a>
            </div>
        )
    }
}
