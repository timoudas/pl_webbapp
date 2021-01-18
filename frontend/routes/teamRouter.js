'use strict'

const express = require('express')
const router = express.Router()

const teamsController = require('../controllers/teamsController')

// GET
router.get('/', teamsController.index)


// Exports.
module.exports = router