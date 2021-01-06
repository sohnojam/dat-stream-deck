const { State } = require('../state')
const Interface = require('../interface')

const keypress = require('keypress')

class Controller {

  constructor(config) {

    this.interface = (
      config.interface.type == 'OBSS' ?
        new Interface.OBSS(this, config.interface.address, config.interface.password)
      : config.interface.type == 'SLOBS' ?
        new Interface.SLOBS(this, config.interface.address, config.interface.token)
      :
        null
    )
    this.states = config.states.map(state => {
      return new State(this, state.name, state.keys)
    })
    this.currentState = this.states.find(state => state.name == config.controller.initStateName)

  }

  switchState(stateName) {
    const iState = this.states.find(state => state.name == stateName)
    if (!iState) {
      return false
    }
    this.currentState = iState
  }

  exit() {
    process.stdin.pause()
    process.stdin.setRawMode(false)
    process.exit()
  }

  run() {
    keypress(process.stdin)
    process.stdin.on('keypress', (ch, key) => {
      if (this.currentState) {
        this.currentState.checkKeys({ch, key})
      }
    })
    process.stdin.setRawMode(true)
    process.stdin.resume()
  }

}

module.exports = Controller