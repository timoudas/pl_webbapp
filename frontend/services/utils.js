const { LeagueStandingsModel } = require("../models/LeagueStanding");
const { spawn } = require('child_process');
const axios = require('axios');

// Header values
let config = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://www.premierleague.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
  }




module.exports = {
    latestSeasonId,
    latestSeasonLabel,
    getSeasons,
    updateData,
}

/**
 * Get latest seasonId
 */
async function latestSeasonId(){
    try {
        const resp = await axios({
            method: 'get',
            url: 'https://footballapi.pulselive.com/football/competitions/1/compseasons/current',
            params: {'pageSize': '100'},
            headers: config
          })
          var seasonId = resp.data.id
          return seasonId
    } catch (error) {
        console.log(error);
    }
}


/** 
 * Updates all the data
 * @param {string} SeasonId - Id for specific season
*/
async function updateData(){
    const pyProg = spawn('python', ['./../premier_league_api/cli_stats/subprocess_cli.py', '-u', '-ptfles', 'en_pr']);
    pyProg.stdout.on('data', function(data) {
    console.log(data.toString())
    })
}

async function latestSeasonLabel() {
    var data = await LeagueStandingsModel.aggregate()
        .group({
            '_id': '$seasonId', 'SeasonLabel': { '$first': '$seasonLabel' }
        })
        .sort({
            'SeasonLabel': -1
        })
        .project({
            'SeasonLabel': 1
        })
        .limit(1);
    var seasonId = data[0]['SeasonLabel'];
    return seasonId;
}

async function getSeasons() {
    var data = await LeagueStandingsModel.aggregate()
    .group({
        '_id': {'seasonId': '$seasonId', 'seasonLabel': '$seasonLabel'}
    })
    .project({
        'seasonId': '$_id.seasonId',
        'seasonLabel': '$_id.seasonLabel',
        '_id': 0
    })
    .sort({
        'seasonLabel': -1
    })
    return data
}


