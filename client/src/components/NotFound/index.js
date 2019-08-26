import React, { Component } from 'react'

import './NotFound.css';

export default class NotFound extends Component {
    render() {
        document.body.className = "body-bg-image"
        return (
            <div className="mod-container btn-container">
                <h1>Whoops!</h1>
                <h1>Looks like this page got lost in the void.</h1>
                <button className="btn" style={{width:'300px'}}>
                    Return to Summoner Search
                </button>
            </div>
        )
    }
}
