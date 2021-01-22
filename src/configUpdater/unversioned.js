function unversioned(prevConfig) {

  const newConfig = {
    version: 'cv1',
    ...prevConfig
  }

  return newConfig

}

module.exports = unversioned