const { TeamSquadsModel } = require("../models/TeamSquads");
const { TeamStandingsModel } = require("../models/TeamStandings");
const { LeagueStatsModel } = require("../models/LeagueStanding");
const { FixtureStatsModel } = require("../models/FixtureStats");
const utils = require('../services/utils.js')

module.exports = {
    getTeams,
    getTeamProgress,
    getTeamForm,
    getLatestGames,
}
/**
 * 
 * @param {String} teamId | Id for a team, e.g. 1.
 */
async function getLatestGames(teamId){
    var teamId = parseInt(teamId)
    var data = await TeamStandingsModel.aggregate()
    .match({
        'team_id': teamId,
        'seasonId': await utils.latestSeasonId()
    })
    .sort({
        'gameweek': -1
    })
    .limit(5)
    .unwind(
        'fixtures'
    )
    .project({
        'homeTeam': '$fixtures.home_team_shortName',
        'homeTeamId': '$fixtures.home_team_id',
        'homeTeamScore': '$fixtures.home_team_score',
        'grounds': '$fixtures.grounds',
        'fId': '$fixtures.f_id',
        'clockLabel': '$fixtures.clock_label',
        'awayTeam': '$fixtures.away_team_shortName',
        'awayTeamId': '$fixtures.away_team_id',
        'awayTeamScore': '$fixtures.away_team_score',
        '_id': 0
    })
    return data
}


/**
 * 
 * @param {string} seasonId - Id for a season
 * Returns an array of objects with teamIds
 * 
 */
async function getTeams(season){
    var season = parseInt(season)
    var data = await TeamSquadsModel.aggregate()
    .match({
        'seasonId': season
    })
    .group({
        '_id':{
        'teamId': '$teamId',
        'teamName': '$teamName',
        'teamAbbr': '$teamAbbr'
        } 
    })
    .project({
        'teamId': '$_id.teamId',
        'teamName': '$_id.teamName',
        '_id': 0
    })
    .sort({
        'teamName': 1
    })
    return data
}

async function getTeamProgress(teamId){
    var teamId = parseInt(teamId)
    var data = await TeamStandingsModel.aggregate()   
    .match({
        'seasonId': await utils.latestSeasonId(),
        'team_id': teamId
    })
    .sort({
        'gameweek': 1
    })
    .group({
        '_id': '$team_id',
        'positionAll': {'$push': '$position'},
        'pointsAll': {'$push': '$points'},
        'gameweeks': {'$push': '$gameweek'},
        'teamName': {'$first': '$team_shortName'},
        'teamId': {'$first': '$team_id'}
    })
    return data
}


async function getTeamForm(teamId, limit){
    var teamId = parseInt(teamId)
    var formLimit = (limit == undefined) ? 5 : parseInt(limit)
    var season = await utils.latestSeasonId()
    var data = await TeamStandingsModel.aggregate()
    .match({
        'seasonId': season,
        'team_id': teamId
    })
    .sort({
        'gameweek': -1
    })
    .limit(formLimit)
    .unwind(
        'fixtures'
    )
    .group({
        '_id': '$team_id',
        'teamName': {'$first': '$team_shortName'},
        'form': {
            '$push': {
                '$switch': {
                    'branches': [
                        { 'case': { '$eq': [ '$team_shortName', '$fixtures.home_team_shortName' ] }, 
                            'then': {
                                '$switch': {
                                    'branches' : [
                                        {'case': { '$eq': [ '$fixtures.home_team_score', '$fixtures.away_team_score' ] }, 'then': 'D' },
                                        {'case': { '$gt': [ '$fixtures.home_team_score', '$fixtures.away_team_score' ] }, 'then': 'W' },
                                        {'case': { '$lt': [ '$fixtures.home_team_score', '$fixtures.away_team_score' ] }, 'then': 'L' }
                                    ],
                                    'default': "home wrong"
                                }
                            } 
                        },
                        { 'case': { '$eq': [ '$team_shortName', '$fixtures.away_team_shortName' ] },
                            'then': {
                                '$switch': {
                                    'branches': [
                                        {'case': { '$eq': [ '$fixtures.home_team_score', '$fixtures.away_team_score' ] }, 'then': 'D' },
                                        {'case': { '$gt': [ '$fixtures.home_team_score', '$fixtures.away_team_score' ] }, 'then': 'L' },
                                        {'case': { '$lt': [ '$fixtures.home_team_score', '$fixtures.away_team_score' ] }, 'then': 'W' }
                                    ],
                                    'default': "Away wrong"
                                }
                            }
                        }
                    ],
                    'default': "Everything wrong",
                }
            }
        }
    })
    return data
}

async function rankTeams(){
    var season = await utils.latestSeasonId
    var data = await TeamStandingsModel.aggregate()
    .group({
        '_id': {'season': '$seasonId', 'team_id': '$team_id'},
        'teamName': {'$first': '$team_shortName'},
        'avgPosition':  {'$avg': '$position'}
        
    })
    .sort({
        '_id.season': -1,
        'avgPosition': 1,
    })
    .project({
        'season': '$_id.season',
        'teamId': '$_id.team_id',
        'teamName': 1,
        'avgPosition': {'$round': [ '$avgPosition', 1] },
        '_id': 0
    })
    console.log(data)
}
