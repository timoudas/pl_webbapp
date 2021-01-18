const mongoose = require('mongoose')

var LeagueStandingsSchema = new mongoose.Schema({}, 
    { collection : 'league_standings' });

// Compile model from schema
var LeagueStandingsModel = mongoose.model('league_standings', LeagueStandingsSchema);
exports.LeagueStandingsModel = LeagueStandingsModel;

async function filterTableType(){

}

async function filterTableMatchweek(){

}


module.exports={
    LeagueStandingsModel,
}