'use strict'

const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController')

// GET /
router.get('/', homeController.index)
router.post('/', homeController.filterHandler)

// POST /
router.post('/:playerId', homeController.playerHandler)
router.post('/probTeam/:teamId', homeController.teamHandler)



// Exports.
module.exports = router