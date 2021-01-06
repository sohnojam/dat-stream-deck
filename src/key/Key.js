class Key {

  constructor(controller, keyData, actions) {

    this.controller = controller
    this.keyData = keyData
    this.actions = actions

  }

  checkKeyData(data) {
    if (
      (data.key && data.key.name == this.keyData.name)
      ||
      (!data.key && data.ch == this.keyData.ch)
    ) {
      return true
    }
    return false
  }

  executeActions() {

    this.actions.forEach(action => {
      switch(action.type) {
        case 'switchScene': {
          this.controller.interface.switchScene(action.sceneName)
          break
        }
        case 'returnToStoredScene': {
          this.controller.interface.switchScene(this.controller.currentState.storedSceneName)
          break
        }
        case 'setSourceMute': {
          this.controller.interface.setSourceMute(action.sourceName, action.mute)
          break
        }
        case 'setSourceVisibility': {
          this.controller.interface.setSourceVisibility(action.sceneName, action.sourceName, action.visible)
          break
        }
        case 'setTransition': {
          this.controller.interface.setTransition(action.transitionName)
          break
        }
        case 'setTransitionDuration': {
          this.controller.interface.setTransitionDuration(action.transitionDuration)
          break
        }
        case 'switchState': {
          this.controller.switchState(action.stateName)
          break
        }
      }
    })
  }

}

module.exports = Key