class Key {

  constructor(controller, keyData, actions) {

    this.controller = controller
    this.keyData = keyData
    this.actions = actions

  }

  checkKeyData(data) {
    if (
      (data.key && data.key.name == this.keyData.key.name)
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
        case 'connect': {
          this.controller.interface.connect(action.startStateName)
          break
        }
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
        case 'storeCurrentScene': {
          this.controller.currentState.storeSceneName(this.controller.interface.getCurrentScene())
          break
        }
        case 'dropStoredScene': {
          this.controller.currentState.dropSceneName()
          break
        }
        case 'exit': {
          this.controller.exit()
          break
        }
      }
    })
  }

}

module.exports = Key