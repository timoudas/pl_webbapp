'use strict'

const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController')

// GET /
router.get('/', homeController.index)
router.post('/', homeController.filterHandler)
router.post('/:playerId', homeController.playerHandler)



// Exports.
module.exports = router