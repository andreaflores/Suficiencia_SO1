'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InfectadoSchema = Schema({
    name: String,
    location: String,
    age: Number,
    infected_type: String,
    state: String
})

module.exports = mongoose.model('Infectado', InfectadoSchema)