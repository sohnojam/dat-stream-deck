const { Key } = require("../key")

class State {

  constructor(controller, name, keys) {

    this.controller = controller
    this.name = name
    this.keys = keys.map(key => {
      return new Key(this.controller, key.keyData, key.actions)
    })
    this.storedSceneName = ''

  }

  storeSceneName(sceneName) {
    console.log(sceneName)
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