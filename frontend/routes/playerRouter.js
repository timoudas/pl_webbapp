'use strict'

const express = require('express')
const router = express.Router()

const playersController = require('../controllers/playersController')

// GET /
router.get('/', playersController.index)


// Exports.
module.exports = router