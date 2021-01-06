const OBSWS = require('obs-websocket-js')

class OBSS {

  constructor(controller, address, password) {

    this.controller = controller
    this.address = address
    this.password = password

    this.socket = new OBSWS()
    this.socket.on('ConnectionOpened', (data) => this.handleConnectionOpened(data))
    this.socket.on('ConnectionClosed', (data) => this.handleConnectionClosed(data))
    this.socket.on('AuthenticationSuccess', (data) => this.handleAuthSuccess(data))
    this.socket.on('AuthenticationFailure', (data) => this.handleAuthFailure(data))
    this.socket.on('error', (error) => console.error(error))

  }

  handleConnectionOpened(data) {
    console.log('connected (OBSS)')
  }

  handleConnectionClosed(data) {
    console.log('disconnected (OBSS)')
    this.controller.switchState('init')
  }

  handleAuthSuccess(data) {
    console.log('authenticated (OBSS)')
  }

  handleAuthFailure(data) {
    console.log('authentication failed (OBSS)')
  }

  connect(startStateName) {
    this.socket.connect({
      address: this.address,
      password: this.password,
      secure: false
    })
      .then(() => {
        this.controller.switchState(startStateName)
      }).catch(error => {
        console.error(error)
      })
  }

  switchScene(sceneName) {
    this.socket.send('SetCurrentScene', {'scene-name': sceneName})
      .catch(error => console.error(error))
  }

  getCurrentScene() {
    this.socket.send('GetCurrentScene')
      .then(data => {
        return data ? data.name : ''
      })
  }

  setSourceMute(sourceName, mute) {
    this.socket.send('SetMute', {source: sourceName, mute: mute})
      .catch(error => console.error(error))
  }

  setSourceVisible(sceneName, sourceName, visible) {
    this.socket.send('SetSceneItemRender', {'scene-name': sceneName, source: sourceName, render: visible})
      .catch(error => console.error(error))
  }

  setTransition(transitionName) {
    this.socket.send('SetCurrentTransition', {'transition-name': transitionName})
      .catch(error => console.error(error))
  }

  setTransitionDuration(transitionDuration) {
    thiss.socket.send('SetTransitionDuration', {duration: transitionDuration})
      .catch(error => console.error(error))
  }

}

module.exports = OBSS