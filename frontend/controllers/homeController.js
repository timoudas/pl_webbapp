'use strict'

const homeController = {}
const ScheduleServices = require('../services/ScheduleService')
const TeamPlayersServices = require('../services/TeamPlayersService')
const OddsServices = require('../services/OddsServices')
const FixtureServices = require('../services/FixtureServices')


/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
homeController.index = async function (req, res) {
    // res.locals.odds = await OddsServices.getOdds()
    res.locals.schedule = await ScheduleServices.getGameWeekSchedule()
    res.locals.passes = await TeamPlayersServices.getKeyPassPlayers()
    res.locals.shots = await TeamPlayersServices.getBestShotPlayers()

    res.render('home/home');
}

homeController.filterHandler = async function (req,res){
    var queryval = req.query.statsType
    if (queryval == 1) {
        var passes = await TeamPlayersServices.getKeyPassPlayers()
        res.json(passes)
        res.end()
    } else if(queryval == 2){
        var shots = await TeamPlayersServices.getBestShotPlayers()
        res.json(shots)
        res.end()
    } else {
        var shots = await TeamPlayersServices.getBestTacklePlayers()
        res.json(shots)
        res.end()
    }
}

homeController.playerHandler = async function(req, res){
    var queryval = req.query.playerId
    var playerInfo = await TeamPlayersServices.getPlayersInfo(queryval)
    res.json(playerInfo)
    res.end()
}

module.exports = homeController