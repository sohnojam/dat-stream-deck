function versionChecker(config) {
  return config.version || 'unversioned'
}

module.exports = versionChecker