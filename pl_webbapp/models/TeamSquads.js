const mongoose = require('mongoose')

var TeamSquadsSchema = new mongoose.Schema({}, 
    { collection : 'team_squads' });

var TeamSquadsModel = mongoose.model('team_squads', TeamSquadsSchema);

module.exports = {TeamSquadsModel}