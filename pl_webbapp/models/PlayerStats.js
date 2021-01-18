const mongoose = require('mongoose')

var PlayerStatsSchema = new mongoose.Schema({}, 
    { collection : 'player_stats' });

var PlayerStatsModel = mongoose.model('player_stats', PlayerStatsSchema);

module.exports ={PlayerStatsModel}