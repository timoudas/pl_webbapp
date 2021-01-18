const mongoose = require('mongoose')

var PlayerFixtureStatsSchema = new mongoose.Schema({}, 
    { collection : 'fixture_players_stats' });

var PlayerFixtureStatsModel = mongoose.model('fixture_players_stats', PlayerFixtureStatsSchema);

module.exports = {PlayerFixtureStatsModel}