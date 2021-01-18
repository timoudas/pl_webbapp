'use strict'

const TeamsController = {};
const teamsServices = require('../services/TeamServices');
const utils = require('../services/utils.js');


/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
TeamsController.index = async function (req, res) {
    try {
        var seasons = await utils.getSeasons()
        var teams = await teamsServices.getTeams()
        console.log(season)
    } catch (error) {
        console.log(error)
    }
    res.locals.seasons = seasons
    res.locals.teams = teams
    res.render('teams/teamsindex');
}

module.exports = TeamsController