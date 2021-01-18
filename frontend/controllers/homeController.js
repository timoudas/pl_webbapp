'use strict'

const homeController = {}
const ScheduleServices = require('../services/ScheduleService')
const TeamPlayersServices = require('../services/TeamPlayersService')
const OddsServices = require('../services/OddsServices')


/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
homeController.index = async function (req, res) {
    // res.locals.odds = await OddsServices.getOdds()
    res.locals.schedule = await ScheduleServices.getSchedule()
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
        console.log('hello')
    }
}

module.exports = homeController