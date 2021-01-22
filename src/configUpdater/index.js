const versionChecker = require('./versionChecker')
const unversioned = require('./unversioned')

function needsUpdate(config) {
  const currentVersion = 'cv1'
  return versionChecker(config) !== currentVersion
}

function updateConfig(config) {

  if (versionChecker(config) === 'unversioned') {
    let newConfig = config
    newConfig = unversioned(newConfig)
    return newConfig
  } else {
    return config
  }

}

module.exports = {
  needsUpdate,
  updateConfig
}