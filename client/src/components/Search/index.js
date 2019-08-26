import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import Notification from '../Notification/index';
import './Search.css';

export default class Search extends Component {

    constructor() {
        super();
        this.state = {
            summonerName: "",
            redirectToProfile: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }



    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.summonerName || this.state.summonerName === "") {
            toast.dismiss();
            toast.error(<Notification message="Please enter a Summoner Name!" />, { position: toast.POSITION.TOP_CENTER });
        } else {
            this.setState({ redirectToProfile: true });
        }
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    render() {
        if (this.state.redirectToProfile) {
            return (
                <Redirect to={{
                    pathname: `/profile/${this.state.summonerName}`,
                    state: { summonerName: this.state.summonerName }
                }}
                />
            )
        }
        document.body.className = "body-bg-image";

        return (
            <div className="mod-container">
            <div className="search container">
                <h1>Find Summoner Stats</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Summoner Name</label>
                        <input type="text"
                            name="summonerName"
                            placeholder="Summoner Name"
                            value={this.state.summonerName}
                            onChange={this.handleChange} />
                    </div>
                    <div className="form-group btn-container">
                        <button className="btn">Submit</button>
                    </div>
                </form>
            </div>
            </div>
        )
    }
}
