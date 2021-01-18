const { LeagueStandingsModel } = require("../models/LeagueStanding");
const { spawn } = require('child_process');

module.exports = {
    latestSeasonId,
    latestSeasonLabel,
    getSeasons,
    updateData,
}

/**
 * Gets latest season from db
 */
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


async function latestSeasonId() {
    var data = await LeagueStandingsModel.aggregate()
        .group({
            '_id': '$seasonId', 'SeasonLabel': { '$first': '$seasonLabel' }
        })
        .project({
            'season': {
                '$substr': ['$SeasonLabel', 0, 4]
            },
        })
        .sort({
            'season': -1
        })
        .project({
            'season': 0
        })
        .limit(1);
    var seasonId = data[0]['_id'];
    return seasonId;
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


