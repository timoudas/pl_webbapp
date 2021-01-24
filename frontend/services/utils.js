const { LeagueStandingsModel } = require("../models/LeagueStanding");
const fs = require("fs")
const { spawn } = require('child_process');
const axios = require('axios');

// Header values
let config = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://www.premierleague.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
  }


module.exports = {
    latestSeasonId,
    latestSeasonLabel,
    getSeasons,
    updateData,
    writeData
}

/**
 * 
 * @param {string} filename | filename, e.g. schedule.json
 */
async function dataExists(fileName){
    let dataDir = `./data/${fileName}`
    let date = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
    try {
        file = await fs.promises.stat(dataDir)
            if (file.birthtimeMs < date){
                console.log('hi')
                data = await JSON.parse(await loadData(dataDir)) 
                return data
            } else{ 
                return false
            }
    } catch {
        return false
    }
}


async function loadData(fileName){
    data = await fs.promises.readFile(fileName)
    return data
}

async function writeData(fileName, data){
    data = await JSON.stringify(data, null, 4);
    await fs.promises.writeFile(fileName, data);
    console.log(`${fileName} saved`)
}


/**
 * Get latest seasonId
 */
async function latestSeasonId(){
    try {
        const resp = await axios({
            method: 'get',
            url: 'https://footballapi.pulselive.com/football/competitions/1/compseasons/current',
            params: {'pageSize': '100'},
            headers: config
          })
          var seasonId = resp.data.id
          return seasonId
    } catch (error) {
        console.log(error);
    }
}


/** 
 * Updates all the data
 * @param {string} SeasonId - Id for specific season
*/
async function updateData(){
    const pyProg = spawn('python', ['./../premier_league_api/cli_stats/subprocess_cli.py', '-u', '-ptfles', 'en_pr']);
    pyProg.stdout.on('data', function(data) {
    console.log(data.toString())
    })
}

async function latestSeasonLabel() {
    var data = await LeagueStandingsModel.aggregate()
        .group({
            '_id': '$seasonId', 'SeasonLabel': { '$first': '$seasonLabel' }
        })
        .sort({
            'SeasonLabel': -1
        })
        .project({
            'SeasonLabel': 1
        })
        .limit(1);
    var seasonId = data[0]['SeasonLabel'];
    return seasonId;
}

async function getSeasons() {
    var data = await LeagueStandingsModel.aggregate()
    .group({
        '_id': {'seasonId': '$seasonId', 'seasonLabel': '$seasonLabel'}
    })
    .project({
        'seasonId': '$_id.seasonId',
        'seasonLabel': '$_id.seasonLabel',
        '_id': 0
    })
    .sort({
        'seasonLabel': -1
    })
    return data
}

