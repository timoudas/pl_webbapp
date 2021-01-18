'use strict';
const { response } = require('express');
const { default: got } = require('got');
var axios = require('axios');
const keys = require('../configs/keys');
const { Collection } = require('mongoose');

module.exports = {
    getOdds
}

/**
 * 
 * @param {string} market: h2h, spreads, totals 
 */
async function reqOdds(market){
    const defaultMarket = 'h2h'
    var propertiesObj = {sport:'soccer_epl', region:'eu', 
        mkt:(market != undefined) ? defaultMarket : market,
        apiKey: keys.OddsApi};
        const response = await axios('https://api.the-odds-api.com/v3/odds/', {
            params: propertiesObj
        })
        return response.data
    }


async function getOdds(market){
    const data = await reqOdds(market)
    let odds = []
    for (var i=0; i<7; i++){
        odds[i] = data.data[i]
    }
    return odds
}

