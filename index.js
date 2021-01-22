const { Controller } = require('./src/controller')
const ConfigUpdater = require('./src/configUpdater')
const fs = require('fs')

const configFileData = fs.readFileSync('./dsdconfig.json')
let config = JSON.parse(configFileData)
if (ConfigUpdater.needsUpdate(config)) {
  fs.writeFileSync('./dsdconfig_backup.json', JSON.stringify(config))
  config = ConfigUpdater.updateConfig(config)
  fs.writeFileSync('./dsdconfig.json', JSON.stringify(config))
}

const controller = new Controller(config)
controller.run()
