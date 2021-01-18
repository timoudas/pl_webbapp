'use strict'

const playerController = {}
const ScheduleServices = require('../services/ScheduleService')
const TeamPlayersServices = require('../services/TeamPlayersService')


/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
playerController.index = async function (req, res) {
    res.locals.defenders = await TeamPlayersServices.getBestDef()
    res.render('players/playerindex');
}

module.exports = playerController