const { TeamSquadsModel } = require("../models/TeamSquads");
const { PlayerFixtureStatsModel } = require("../models/FixturePlayer");
const { PlayerStatsModel } = require("../models/PlayerStats");
const { FixtureStatsModel } = require("../models/FixtureStats");
const utils = require('../services/utils.js')

module.exports = {
    getKeyPassPlayers,
    getBestShotPlayers,
    getPlayers,
    getBestDef,
    getBestMid,
    getBestAtt,
}




/**
 * 
 * @param {string} seasonId - Id for a season
 * @param {string} teamId - Id for a team
 * Returns an array of objects of all players in a team
 */
async function getPlayers(seasonId, teamId){
    var data = await TeamSquadsModel.aggregate()
    .match({
        'seasonId': parseInt(seasonId),
        'teamId': parseInt(teamId)
    })
    .unwind(
        '$players'
    )
    .group({
        '_id': {
            'players': '$players'
        }
    })
    .project({
        'playerId': '$_id.players.p_id',
        'playerName': '$_id.players.name',
        '_id': 0
    })
    .group({
        '_id': {
            'playerId': '$playerId',
            'playerName': '$playerName'
        }
    })
    .project({
        'playerId': '$_id.playerId',
        'playerName': '$_id.playerName',
        '_id': 0
    })
    return data
}


async function getKeyPassPlayers(){
    var season = await utils.latestSeasonId()
    var data = await PlayerFixtureStatsModel.aggregate()
    .match({
        'seasonId': season
    })
    .group({
        '_id': {
            'id': '$id', 
            'season': '$seasonId', 
        },
        'total_pass': {'$sum': '$total_pass'},
        'total_mins_played': {'$sum': '$mins_played'},
        'name': {'$first': '$name'},
        'stdDevPasses': { '$stdDevSamp': {'$divide': [ '$total_pass', '$mins_played'] } },
        'averagePasses': { '$avg': { '$divide': ['$total_pass', '$mins_played'] } }
    })
    .project({
        'totalPlaytime': '$total_mins_played',
        'total_pass': 1,
        'stdDevPasses': { '$round':[ {'$multiply': [ '$stdDevPasses', 90 ] }, 2] },
        'averagePasses': { '$round': [ { '$multiply': ['$averagePasses', 90] }, 2 ] },
        'name': '$name',
        'id': '$_id.id',
        'seasonId': '$_id.season',
        '_id': 0
    })
    .sort({
        'total_pass': -1
    })
    .limit(50)
    .lookup({
        'from': 'team_squads',
        'let': {'id': '$id', 'seasonId': '$seasonId'},
        'pipeline': [
            { '$match': {"$expr": { '$eq': [ "$seasonId", "$$seasonId" ] } } },
            { "$unwind": "$players" },
            { "$match": { "$expr": { "$eq": ["$players.p_id", "$$id"] } } },
         ],
        'as': 'player_stats'
    })
    .unwind(
        'player_stats'
    )
    .project({
        'totalPlaytime': 1,
        'total_pass': 1,
        'name': 1,
        'id': 1,
        'seasonId': 1,
        'teamId': '$player_stats.teamId',
        'teamName': '$player_stats.teamShortName',
        'appearances': '$player_stats.players.appearances',
        'position': '$player_stats.players.position',
        'averagePasses': 1,
        'stdDevPasses': 1,
        'averagePlaytime': {'$round': [ {'$divide':['$totalPlaytime', '$player_stats.players.appearances'] }, 1] },
        '_id': 0
    })
    .sort({
        'averagePasses': -1,
        'averagePlaytime': -1,
        'teamId': 1
    })

    console.log(data)
    return data
}

getKeyPassPlayers()

async function getAvgPlayerSeasonPasses(playerId){
    var season = await utils.latestSeasonId()
    var data = await FixtureStatsModel.aggregate()
    .match({
        'seasonId': season,
    })
    .unwind(
        'lineUps'
    )
    .unwind(
        'substitutes'
    )
    .match({
        '$or': [
            {'lineUps.id': playerId}, {'substitutes.id': playerId}
        ]
    })
    
    /* TODO: FINISH PIPELINE */
    return data
}


async function getBestShotPlayers(){
    var season = await utils.latestSeasonId()
    var data = await PlayerFixtureStatsModel.aggregate()
    .match({
        'seasonId': season
    })
    .group({
        '_id': {
            'id': '$id', 
            'season': '$seasonId', 
        },
        'goals': {'$sum': '$goals'},
        'shotOffTarget': {'$sum': '$shot_off_target'},
        'hitWoodWord': {'$sum': '$hit_woodwork'},
        'name': {'$first': '$name'},
        'totalShots': {'$sum': '$total_scoring_att' },
        'totalPlaytime': {'$sum': '$mins_played'},
    })
    .sort({
        'totalShots': -1
    })
    .limit(50)
    .lookup({
        'from': 'team_squads',
        'let': {'id': '$_id.id', 'seasonId': '$_id.season'},
        'pipeline': [
            { '$match': {"$expr": { '$eq': [ "$seasonId", "$$seasonId" ] } } },
            { "$unwind": "$players" },
            { "$match": { "$expr": { "$eq": ["$players.p_id", "$$id"] } } },
         ],
        'as': 'player_stats'
    })
    .unwind(
        'player_stats'
    )
    .project({
        'totalPlaytime': 1,
        'totalShots': 1,
        'goals': 1,
        'shotOffTarget': 1,
        'shotsOnTarget': {'$subtract': ['$totalShots','$shotOffTarget' ] },
        'hitWoodWord': 1,
        'name': 1,
        'seasonId': 1,
        'teamId': '$player_stats.teamId',
        'teamName': '$player_stats.teamShortName',
        'appearances': '$player_stats.players.appearances',
        'position': '$player_stats.players.position',
        'id': '$_id.id',
        'seasonId': '$_id.season',
        'averageShotsPerGame': {'$round': [ {'$divide':['$totalShots', '$player_stats.players.appearances'] }, 1] },
        'averageShotsOnTarget': {'$round': [ {'$divide': [ {'$subtract': ['$totalShots','$shotOffTarget' ] } ,'$player_stats.players.appearances'] }, 1] },
        '_id': 0
    })
    .sort({
        'averageShotsPerGame': -1,
        'averageShotsOnTarget': -1,
        'teamId': 1
    })
    return data
}

async function getBestDef(){
    var season = await utils.latestSeasonId()
    var data = await PlayerStatsModel.aggregate()
    .match({
        'position': 'D',
        'seasonId': season
    })
    .lookup({
        'from': 'team_squads',
        'let': {'id': '$id', 'seasonId': '$seasonId'},
        'pipeline': [
            { '$match': {"$expr": { '$eq': [ "$seasonId", "$$seasonId" ] } } },
            { "$unwind": "$players" },
            { "$match": { "$expr": { "$eq": ["$players.p_id", "$$id"] } } },
         ],
        'as': 'playerInfo'
    })
    .unwind(
        'playerInfo'
    )
    .sort({
        'blocked_scoring_att': -1,
        'error_lead_to_goal': 1,
        'total_tackles': -1,
        'mins_played': -1,
        'effective_clearance': -1,
    })
    .project({
        '_id': 0,
        'name': 1,
        'teamName': '$playerInfo.teamShortName',
        'id': 1,
    })
    .limit(15)
    return(data)
}

async function getBestMid(){
    /* TODO: CREATE PIPELINE */
}

async function getBestAtt(){
    /* TODO: CREATE PIPELINE */
}

