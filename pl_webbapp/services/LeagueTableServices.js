const { LeagueStandingsModel } = require("../models/LeagueStanding");
const { TeamStandingsModel } = require("../models/TeamStandings");
const utils = require('../services/utils.js')
const { spawn } = require('child_process');

module.exports = {
    getTable,
    filterTableSeason,
    filterMatchweeks,
    updateTableData
}


/** 
 * Gets league table from db
 * @param {string} SeasonId - Id for specific season
*/
function updateTableData(){
    const pyProg = spawn('python', ['./../premier_league_api/cli_stats/subprocess_cli.py', '-u', '-l', 'en_pr']);
    pyProg.stdout.on('data', function(data) {
    console.log('Update completed');
    })
}

async function getTable(seasonId, tableType="overall",) {

        seasonId = parseInt(seasonId);
        var tableType = tableType

    var data = await LeagueStandingsModel.aggregate()
        .match({
            'seasonId': seasonId
        })
        .unwind(
            `$${tableType}`
        )
        .project({
            'position': 1,
            'team_shortName': 1,
            'team_id': 1,
            'played': `$${tableType}.played`,
            'won': `$${tableType}.won`,
            'drawn': `$${tableType}.drawn`,
            'lost': `$${tableType}.lost`,
            'goalsFor': `$${tableType}.goalsFor`,
            'goalsAgainst': `$${tableType}.goalsAgainst`,
            'goalsDifference': `$${tableType}.goalsDifference`,
            'points': `$${tableType}.points`,
            '_id': 0,
        })
        .sort({
            'points': -1,
            'goalsDifference': -1
        });
    return data;
}


/**
 * Gets all seasonsIds and seasonLabels from db
 */
async function filterTableSeason() {
    var data = await LeagueStandingsModel.aggregate()
        .group({
            '_id': '$seasonId', 'SeasonLabel': { '$first': '$seasonLabel' }
        })
        .sort({
            '_id': -1
        });
    return data;
}

async function filterMatchweeks(seasonId) {
    seasonId = parseInt(seasonId);
    var data = await TeamStandingsModel.aggregate()
    .match({
        'seasonId': seasonId
    })
    .group({
        '_id': '$gameweek', 'matchweek': { '$first': '$gameweek' }
    })
    .sort({
        '_id': 1
    });
    var allMatchWeeks = data.slice(-1)[0]['_id']
    data.unshift({'_id':allMatchWeeks, 'matchweek': 'All Matchweeks'})
    return data;
}



