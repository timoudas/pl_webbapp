const mongoose = require('mongoose')

var ScheduleSchema = new mongoose.Schema({}, 
    { collection : 'schedule' });

var ScheduleModel = mongoose.model('schedule', ScheduleSchema);

module.exports = {ScheduleModel}