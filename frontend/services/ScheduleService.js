const { ScheduleModel } = require("../models/Schedule");
const utils = require('../services/utils.js')


async function getSchedule(){

    var data = await ScheduleModel.aggregate()
        .sort({
            'provisionalKickoff.millis': -1
        })
        .addFields({
            'date': {
                '$toDate': '$provisionalKickoff.millis'
            },
            'currentDate': '$$NOW'
        })
        .match({
            '$expr': { '$gt': ['$date', '$currentDate'] }
        })

        .project({
            'dateString': {'$dateToString': {'format':'%d/%m %H:%M', 'date':'$date', 'timezone': '+0100'} },
            'date': 1,
            'teams': 1,
            'currentDate': 1,
            '_id': 0,
        })
        .sort({'date': 1})
        .limit(7)
    // utils.writeData('./data/schedule.json', data)
    return data
}


module.exports = {
    getSchedule,
}