class State {

  constructor(controller, name, keys) {

    this.controller = controller
    this.name = name
    this.keys = keys
    this.storedSceneName = ''

  }

  storeSceneName(sceneName) {
    if (sceneName) {
      this.storedSceneName = sceneName
    }
  }

  dropSceneName() {
    this.storedSceneName = ''
  }

  checkKeys(data) {
    const fKey = this.keys.find(key => key.checkKeyData(data))
    if (fKey) {
      fKey.executeActions()
    }
  }

}

module.exports = State