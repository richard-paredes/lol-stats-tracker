const express   = require ('express'),
    router      = express.Router({mergeParams: true}),
    fetch       = require('node-fetch'),
    middleware  = require('../middleware/index');

// api headers
const headers = { 'X-Riot-Token': process.env.TRACKER_API_KEY };

// returns an object with summoner data
router.get('/summoners/:summonerName', async (req, res) => {
    try {
        const { summonerName } = req.params;
        const baseURL = process.env.SUMMONER_API_URL_BY_NAME + '/';
        // extract summoner ID
        let response = await fetch(baseURL + summonerName, { headers } );
        console.log(`${process.env.SUMMONER_API_URL_BY_NAME}/${summonerName}`)
        const summonerData = await response.json();
        // will not continue the api calls if error is present.
        if (middleware.checkStatusError(summonerData, res)) return;
        
        return res.json(summonerData);

    } catch (err) {
        res.status(500).json({
            message: 'Server Error while retrieving summoner data',
            error: err.message
        });
    }
});

// returns array of champion objects
router.get('/champions/:summonerID', async (req, res) => {
    try{
        const { summonerID } = req.params;
        let response = await fetch(`${process.env.CHAMPION_API_URL_BY_ID}/${summonerID}`, {headers} );
        const championData = await response.json();

        if (middleware.checkStatusError(championData, res)) return;

        return res.json(championData);

    } catch(err) {
        res.status(500).json({
            message: 'Server Error while retrieving champion data'
        });
    }
});

// returns an array with up to two objects: 
// 1. normal ranked
// 2. tft ranked
router.get('/ranks/:summonerID', async (req, res) => {
    try{
        const { summonerID } = req.params;
        let response = await fetch(`${process.env.STATS_API_URL_BY_ID}/${summonerID}`, { headers });
        const rankedData = await response.json();
        if (middleware.checkStatusError(rankedData, res)) return;

        return res.json(rankedData);
    } catch(err) {
        res.status(500).json({
            message: 'Server Error while retrieving ranked data'
        });
    }
});

module.exports = router;

