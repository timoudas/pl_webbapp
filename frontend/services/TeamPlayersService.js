const { TeamSquadsModel } = require("../models/TeamSquads");
const { PlayerFixtureStatsModel } = require("../models/FixturePlayer");
const { PlayerStatsModel } = require("../models/PlayerStats");
const { FixtureStatsModel } = require("../models/FixtureStats");
const utils = require('../services/utils.js')

module.exports = {
    getPlayersInfo,
    getKeyPassPlayers,
    getBestShotPlayers,
    getPlayers,
    getBestDef,
    getBestMid,
    getBestAtt,
}

/**
 * 
 * @param {Integer} playerId | Get basic info for player
 */

async function getPlayersInfo(playerId){
    var season = await utils.latestSeasonId()
    
    var data = await PlayerFixtureStatsModel.aggregate()
    .match({
        'seasonId': season,
        'id': parseInt(playerId)
    })
    .lookup({
        'from': 'fixture_stats',
        'let': {'id': '$f_id'},
        'pipeline': [
            { '$match': {"$expr": { '$eq': [ "$f_id", "$$id" ] } } },
         ],
        'as': 'fixtures'
    })
    .unwind(
        'fixtures'
    )
    .project({
        'gameWeek': '$fixtures.gameweek',
        'id' : 1,
        'f_id': 1,
        'seasonId': 1,
        'total_pass': 1,
        'mins_played': 1,
        'name': 1,
        'goals': 1,
        'shot_off_target': 1,
        'hit_woodwork': 1,
        'total_scoring_att': 1,
        '_id': 0,
    })
    .group({
        '_id': {
            'gameWeek': '$gameWeek', 
            'fId': '$f_id'
        },
        'minsPlayed': {'$sum': '$mins_played'},
        'totalPass': {'$sum': '$total_pass'},
        'totalMinsPlayed': {'$sum': '$mins_played'},
        'name': {'$first': '$name'},
        'id': {'$first': '$id'},
        'seasonId': {'$first': '$seasonId'},
        'goals': {'$sum': '$goals'},
        'shotOffTarget': {'$sum': '$shot_off_target'},
        'hitWoodWord': {'$sum': '$hit_woodwork'},
        'totalShots': {'$sum': '$total_scoring_att' },
        'totalPlaytime': {'$sum': '$mins_played'},
    })
    .sort({
        '_id': 1
    })
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
        'pass': '$totalPass',
        'minsPlayed': '$totalMinsPlayed',
        'shots': '$totalShots',
        'shotOffTarget': 1,
        'shotsOnTarget': {'$subtract': ['$totalShots','$shotOffTarget' ] },
        'hitWoodWord': 1,
        'Name': '$name',
        'id': 1,
        'seasonId': 1,
        'goals': 1,
        'teamId': '$player_stats.teamId',
        'Club': '$player_stats.teamShortName',
        'Appearances': '$player_stats.players.appearances',
        'position': '$player_stats.players.position',
        'PositionInfo': '$player_stats.players.positionInfo',
        'Country': '$player_stats.players.country',
        'fId': '$_id.fId',
        'gameWeek': '$_id.gameWeek',
        '_id': 0
    })
    var index = 0
    var cumPass = 0
    var cumMinsPlayed = 0
    var cumShots = 0
    var cumShotOffTarget = 0
    var cumShotsOnTarget = 0
    var cumHitWoodWord = 0
    data.map(doc => {
        index += 1
        cumPass += doc.pass
        cumMinsPlayed += doc.minsPlayed
        cumShots += doc.shots
        cumShotOffTarget += doc.shotOffTarget
        cumShotsOnTarget += doc.shotsOnTarget
        cumHitWoodWord += doc.hitWoodWord
        return Object.assign(doc, { 
            totalPass: cumPass,
            totalMinsPlayed: cumMinsPlayed,
            totalShots: cumShots,
            totalShotOffTarget: cumShotOffTarget,
            totalShotsOnTarget: cumShotsOnTarget,
            totalHitWoodWord: cumHitWoodWord,
            avgPass: +(cumPass / index).toFixed(1),
            avMinsPlayed: +(cumMinsPlayed / index).toFixed(1),
            avgShots: +(cumShots / index).toFixed(1),
            avgShotsOffTarget: +(cumShotOffTarget / index).toFixed(1),
            avgShotsOnTarget: +(cumShotsOnTarget / index).toFixed(1),
        });
    })
    return data
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
    return data
}


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
        'totalShots': {'$sum': '$total_scoring_att' },
        'totalPlaytime': {'$sum': '$mins_played'},
        'name': {'$first': '$name'},
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

async function getBestTacklePlayers(){
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
        'totalTackle': {'$sum': '$total_tackle'},
        'totalWonTackle': {'$sum': '$won_tackle'},
        'totalfouls': {'$sum': '$fouls'},
        'totalAttemptedTackleFoul': {'$sum': '$attempted_tackle_foul' },
        'totalPlaytime': {'$sum': '$mins_played'},
        'name': {'$first': '$name'},
    })
    .sort({
        'totalTackle': -1
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
        'totalTackle': 1,
        'totalWonTackle': 1,
        'totalfouls': 1,
        'totalAttemptedTackleFoul': 1,
        'name': 1,
        'seasonId': 1,
        'teamId': '$player_stats.teamId',
        'teamName': '$player_stats.teamShortName',
        'appearances': '$player_stats.players.appearances',
        'position': '$player_stats.players.position',
        'id': '$_id.id',
        'seasonId': '$_id.season',
        'avgTackle': {'$round': [ {'$divide':['$totalTackle', '$player_stats.players.appearances'] }, 1] },
        'avgWonTackle': {'$round': [ {'$divide': [ '$totalWonTackle','$player_stats.players.appearances'] }, 1] },
        'avgFoul': {'$round': [ {'$divide': [ '$totalfouls','$player_stats.players.appearances'] }, 1] },
        '_id': 0
    })
    .sort({
        'avgTackle': -1,
        'avgWonTackle': -1,
        'teamId': 1
    })
    console.log(data)
    return data
}
getBestTacklePlayers()

async function getBestDef(){

    /**
     * let dataIsPresence = file(../data/playerFile.json)
     * 
     * if (dataIsPresence) {
     *    return dataIsPresence
     * } else {
     *  ...
     * }
     */

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

    /**
     * if !dataIsPresence => data.writeToFile(../data/playerFile.json)
     */

    return(data)
}

async function getBestMid(){
    /* TODO: CREATE PIPELINE */
}

async function getBestAtt(){
    /* TODO: CREATE PIPELINE */
}

