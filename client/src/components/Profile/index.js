import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import Notification from '../Notification/index';
import Loading from '../Loading/index';
import './Profile.css';

// used to import all icons for RANKS
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { 
        return images[item.replace('./', '')] = r(item); 
    });
    return images;
}
const images = importAll(require.context('./../../assets/images/ranks/', false, /\.(png|jpe?g|svg)$/));

class Profile extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            redirectToSearch: false,
            profileData: null,
            summonerData: null,
            championData: null,
            tftRankedData: null,
            regRankedData: null,
            summonerImageURL: null,
            rankedImageURL: null,
            championImageURL: null,
            championName: null,
            cdnVersion: '9.16.1'
        }
        this.handleClick = this.handleClick.bind(this);
        this.findImageURL = this.findImageURL.bind(this);
        this.findChampionName = this.findChampionName.bind(this);
    }

    async componentDidMount() {
        try {
            const summoner_api_response = await axios.get(`/api/v1/profile/summoners/${this.props.location.state.summonerName}`);
            const champion_api_response = await axios.get(`/api/v1/profile/champions/${summoner_api_response.data.id}`);
            const rank_api_response = await axios.get(`/api/v1/profile/ranks/${summoner_api_response.data.id}`);
            const cdn_response = await axios.get(`https://ddragon.leagueoflegends.com/api/versions.json`);

            const cdnVersion = cdn_response.data[0]; // array of cdn versions, first item is most recent update
            const summonerData = summoner_api_response.data // object with summoner information
            const championData = (champion_api_response.data) ? champion_api_response.data : null // array with champion mastery information
            
            let regRankedData = null;
            let tftRankedData = null;

            // check if any ranked statistics available
            if (rank_api_response) {
                
                regRankedData = (rank_api_response.data[0]) ? rank_api_response.data[0] : null // object with some kind of ranked data
                tftRankedData = (rank_api_response.data[1]) ? rank_api_response.data[1] : null // object with some kind of ranked data
                
                // switch ranked data if needed
                if (regRankedData) {
                    regRankedData = (regRankedData.queueType === 'RANKED_SOLO_5x5') ? regRankedData : rank_api_response.data[1];
                }
                if (tftRankedData) {
                    tftRankedData = (tftRankedData.queueType === 'RANKED_TFT') ? tftRankedData : rank_api_response.data[0];
                }
            }
            
            // link to CDN for summoner icon
            const summonerImageURL = `https://ddragon.leagueoflegends.com/cdn/${cdnVersion}/img/profileicon/${summonerData.profileIconId}.png`
            
            // local link in project workspace for rank icon
            // un-ranked default values: iron 4;
            const regRankedImageURL = (regRankedData) ? this.findImageURL(regRankedData.tier, regRankedData.rank) : 'iron_4.png';
            const tftRankedImageURL = (tftRankedData) ? this.findImageURL(tftRankedData.tier, tftRankedData.rank) : 'iron_4.png';

            // link to CDN for champion icon
            const mostUsedChampion = (championData)? championData[0] : null;
            const { refinedChampionName, rawChampionName } = await this.findChampionName(cdnVersion, mostUsedChampion.championId);
            let championImageURL = (refinedChampionName) ? `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${refinedChampionName}_0.jpg` : null;
            
            this.setState( {
                loading: false,
                cdnVersion,
                summonerData,
                championData,
                tftRankedData,
                regRankedData,
                summonerImageURL,
                tftRankedImageURL,
                regRankedImageURL,
                championImageURL,
                championName: rawChampionName
            } );

        } catch (err) {
            this.setState( { loading: false, redirectToSearch: true} );
            toast.warn (
                <Notification message="Could not find that Summoner!" />
            )
        }
    }

    handleClick(event) {
        this.setState({ redirectToSearch: true });
    }

    // used to find corresponding image name based on rank + tier
    findImageURL(tier, rank) {
        let result = '';
        result += tier.toLowerCase();

        if (rank === 'I') return (result += '_1.png');
        if (rank === 'II') return (result += '_2.png');
        if (rank === 'III') return (result += '_3.png');
        return (result += '_4.png');
    }

    // used to find a corresponding champion name based on championID
    async findChampionName(cdnVersion, id) {
        if (!id) return null; // null or undefined id's.
        id = id.toString(); // convert long to string
        try {
            const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${cdnVersion}/data/en_US/champion.json`);
            const championList = response.data.data
            for (let champion in championList) {
                if (championList[champion].key === id) {
                    
                    let rawChampionName = championList[champion].name;
                    let championName = rawChampionName.replace('.','');
                    // if contains single quote, need to change capitalization
                    if (championName.includes('\'')) {
                        championName = championName.replace('\'','');
                        championName = championName.slice(0,1) + championName.slice(1).toLowerCase();
                    }
                    return {
                        refinedChampionName: championName,
                        rawChampionName: rawChampionName
                    };
                } 
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    render() {
        document.body.className = 'body-bg-image-2';
        if (this.state.loading) return <Loading />
        if (this.state.redirectToSearch) return <Redirect to="/" />
        
        return (
            <div className='mod-container'>
                <h1 className='summonerName'>
                    <img src={this.state.summonerImageURL} alt="Profile Icon" className="profileImage"/>
                    &ensp;    
                    {this.state.summonerData.name}
                    
                </h1>
                <div className="grid">
                    <div className="championConatiner">
                        {   (this.state.championImageURL)
                            && <img src={this.state.championImageURL} alt="Champion Art" className="championImage"/>
                        }
                        <h4 className="championName">
                            {(this.state.championName)
                                && this.state.championName}
                        </h4>
                    </div>
                    <div className="regRankContainer">
                        <h2>Ranked 5v5:</h2>

                        {   (this.state.regRankedImageURL)
                            && <img src={images[this.state.regRankedImageURL]} alt="RANK5v5" className="rankImage"/>
                        }
                        <h5>
                        { (this.state.regRankedData)
                            ? this.state.regRankedData.tier + ' ' + this.state.regRankedData.rank
                            : 'UNRANKED'
                        }
                        </h5>
                        <ul>
                            <li>
                                <h4>Wins</h4>
                                <p>{(this.state.regRankedData) ? this.state.regRankedData.wins : 0}</p>
                            </li>
                            <li>
                                <h4>Losses</h4>
                                <p>{(this.state.regRankedData) ? this.state.regRankedData.losses : 0}</p>
                            </li>
                        </ul>
                    </div>
                    <div></div>
                    <div className="tftRankContainer">
                        <h2>Ranked TFT:</h2>
                        {
                            (this.state.tftRankedImageURL)
                            && <img src={images[this.state.tftRankedImageURL]} alt="RANKtft" className="rankImage"/>
                        }
                        <h5>
                        { (this.state.tftRankedData)
                            ? this.state.tftRankedData.tier + ' ' + this.state.tftRankedData.rank
                            : 'UNRANKED'
                        }
                        </h5>
                        <ul>
                            <li>
                                <h4>Wins</h4>
                                <p>{(this.state.tftRankedData) ? this.state.tftRankedData.wins : 0}</p>
                            </li>
                            <li>
                                <h4>Losses</h4>
                                <p>{(this.state.tftRankedData) ? this.state.tftRankedData.losses : 0}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="btn-container" style={{height:'50px'}}>
                    <button onClick={this.handleClick} className="btn" style={{height:'25px'}}>
                        Go Back
                    </button>
                </div>
            </div>
            
        )
    }
}

export default withRouter(Profile);
