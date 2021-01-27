const { Controller } = require('./src/controller')
const ConfigUpdater = require('./src/configUpdater')
const fs = require('fs')

const configFileData = fs.readFileSync('./dsdconfig.json')
let config = JSON.parse(configFileData)
if (ConfigUpdater.needsUpdate(config)) {
  try {
    fs.writeFileSync('./dsdconfig_backup.json', JSON.stringify(config))
    config = ConfigUpdater.updateConfig(config)
    fs.writeFileSync('./dsdconfig.json', JSON.stringify(config))
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

const controller = new Controller(config)
controller.run()
