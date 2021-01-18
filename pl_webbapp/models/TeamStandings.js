const mongoose = require('mongoose')


var TeamStandingsSchema = new mongoose.Schema({}, 
    { collection : 'team_standings' });

var TeamStandingsModel = mongoose.model('team_standings', TeamStandingsSchema);

async function formStats() {
    var data = await LeagueStandingsModel.aggregate()
        .group({
            '_id': '$seasonId', 'SeasonLabel': { '$first': '$seasonLabel' }
        })
        .project({
            'season': {
                '$substr': ['$SeasonLabel', 0, 4]
            },
        })
        .sort({
            'season': -1
        })
        .project({
            'season': 0
        })
        .limit(1);
    var seasonId = data[0]['_id'];
    return seasonId;
}

module.exports={TeamStandingsModel}