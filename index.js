const { Controller } = require('./src/controller')
const fs = require('fs')

const configFileData = fs.readFileSync('./dsdconfig.json')
const config = JSON.parse(configFileData)

const controller = new Controller(config)
controller.run()
