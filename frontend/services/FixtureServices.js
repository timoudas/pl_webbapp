const { LeagueStandingsModel } = require("../models/LeagueStanding");
const { TeamStandingsModel } = require("../models/TeamStandings");
const { FixtureStatsModel } = require("../models/FixtureStats");
const utils = require('../services/utils.js')

module.exports = {
    getFixtureResult
}

async function getFixtureResult(fId) {

    var fId = parseInt(fId)
    var data = await FixtureStatsModel.aggregate()
    .match({
        'f_id': fId
    })
    .project({
        '_id': 0,
        'home_team_score': 1,
        'home_team_id': 1,
        'away_team_score': 1,
        'away_team_id': 1,
        'home_team_shortName': 1,
        'away_team_shortName': 1,
    })
    return(data)
}