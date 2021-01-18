'use strict'

const tableController = {}
const { registerDecorator } = require('handlebars')
const { Collection } = require('mongoose')
const LeagueStandingServices = require('../services/LeagueTableServices.js')
const utils = require('../services/utils.js')
const teamServices = require('../services/teamServices.js')


var seasonId = async () => {
    const result = await utils.latestSeasonId()   
    return result
}
var seasonLabel = async () => {
    const result = await utils.latestSeasonLabel()   
    return result
}

  
/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
tableController.index = async function (req, res) {
    try{
        var table = await LeagueStandingServices.getTable(await seasonId())
        var matchweeks = await LeagueStandingServices.filterMatchweeks(await seasonId())
        var seasons = await LeagueStandingServices.filterTableSeason()
    }catch(err){
        console.log(err)
    }
    res.locals.seasonLabel = await seasonLabel()
    res.locals.result = table
    res.locals.matchweeks = matchweeks
    res.locals.seasons = seasons
    res.render('table/tableindex');
}

/**
 * This function handles post requests from the client.
 * 
 * @param {*} req req.body.value will contain the value of the button clicked
 * @param {*} res 
 */

tableController.updateData = async function(req, res){
    await LeagueStandingServices.updateTableData()
    console.log('Data updated')
    res.redirect('table/tableindex')
}




tableController.teamProgPOST = async function (req, res){
    try {
        var teamProgData = await teamServices.getTeamProgress(req.query.teamId)
        var teamForm = await teamServices.getTeamForm(req.query.teamId, 5)
        var teamLatestGames = await teamServices.getLatestGames(req.query.teamId)
    } catch (error) {
        console.log(error)
    }
    var data = {
        teamProgData: teamProgData,
        teamFormData: teamForm,
        teamGameData: teamLatestGames
      };
    res.json(data)
    res.end()
}

tableController.handleFilters = async function (req, res) {
    var table = await LeagueStandingServices
    .getTable(req.query.seasonVal, req.query.typeVal)
        res.json(table)
        res.end()
    }



// Exports
module.exports = tableController 
