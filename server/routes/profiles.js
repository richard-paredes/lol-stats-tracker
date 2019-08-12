const express   = require ('express'),
    router      = express.Router({mergeParams: true}),
    fetch       = require('node-fetch'),
    middleware  = require('../middleware/index');

// api
router.get('/:summonerName', async (req, res) => {
    try {
        const headers = { 'X-Riot-Token': process.env.TRACKER_API_KEY }
        const { summonerName } = req.params;        

        // extract summoner ID
        let response = await 
            fetch(`${process.env.SUMMONER_API_URL_BY_NAME}/${summonerName}`, 
            { headers } );

        const summoner = await response.json();
        
        middleware.checkStatusError(summoner, res);

        // extract summoner's in-game statistics
        response = await 
            fetch(`${process.env.STATS_API_URL_BY_ID}/${summoner.id}`,
            { headers } );
        
        const data = await response.json();

        return res.json(data);

    } catch (err) {
        console.log(`ERROR: ${err.message}`);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});

module.exports = router;

