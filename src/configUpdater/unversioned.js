function unversioned(prevConfig) {

  const newConfig = {
    ...prevConfig,
    version: 'cv1'
  }

  return newConfig

}

module.exports = unversioned