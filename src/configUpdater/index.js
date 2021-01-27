const versionChecker = require('./versionChecker')
const unversioned = require('./unversioned')
const cv1 = require('./cv1')

function needsUpdate(config) {
  const currentVersion = 'cv2'
  return versionChecker(config) !== currentVersion
}

function updateConfig(config) {

  if (versionChecker(config) === 'unversioned') {
    return cv1(unversioned(config))
  } else if (versionChecker(config) === 'cv1') {
    return cv1(config)
  } else {
    throw 'CONFIG_VERSION_ERROR'
  }

}

module.exports = {
  needsUpdate,
  updateConfig
}