const mongoose = require('mongoose')

var FixtureStatsSchema = new mongoose.Schema({}, 
    { collection : 'fixture_stats' });

var FixtureStatsModel = mongoose.model('fixture_stats', FixtureStatsSchema);

module.exports = {FixtureStatsModel}