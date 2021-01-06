const SockJS = require('sockjs-client')

class SLOBS {

  constructor(controller, address, token) {

    this.controller = controller
    this.address = address
    this.token = token

    this.socket = null
    this.currentRequestId = 0

    this.requests = {}
    
    this.scenes = []
    this.sources = []

  }

  handleConnectionOpened(startStateName) {
    console.log('connected (SLOBS)')
    this.socket.request('TcpServerService', 'auth', this.token)
      .then(() => {
        this.handleAuthSuccess(startStateName)
      }).catch(error => {
        this.handleAuthFailure()
      })
  }

  handleConnectionClosed() {
    console.log('disconnected (SLOBS)')
    this.controller.switchState('init')
  }

  handleAuthSuccess(startStateName) {
    console.log('authenticated (SLOBS)')
    this.controller.setState(startStateName)

    this.sendMessage('ScenesService', 'getScenes').then(scenes => this.scenes = scenes)
    this.sendMessage('AudioService', 'getSources').then(sources => this.sources = sources)
  }

  handleAuthFailure() {
    console.log('authentication failed (SLOBS)')
  }

  handleMessage(data) {
    const message = JSON.parse(data)
    const request = this.requests[message.id]

    if (request) {
      if (message.error) {
        request.reject(message.error)
      } else {
        request.resolve(message.result)
      }
      delete this.request[message.id]
    }
  }

  sendMessage(resourceId, methodName, ...args) {
    const id = this.currentRequestId++
    const requestBody = {
      jsonepc: '2.0',
      id,
      method: methodName,
      params: { resource, resourceId, args }
    }

    return new Promise((resolve, reject) => {
      this.requests[requestBody.id] = {
        body: requestBody,
        resolve,
        reject,
        completed: false
      }
      this.socket.send(JSON.stringify(requestBody))
    })
  }


  connect(startStateName) {
    this.socket = new SockJS(this.address)

    this.socket.onopen = () => this.handleConnectionOpened(startStateName)
    this.socket.onclose = () => this.handleConnectionClosed()
    this.socket.onmessage = (event) => this.handleMessage(event.data)
  }

  switchScene(sceneName) {
    const iScene = this.scenes.find(scene => scene.name == sceneName)
    if (!iScene) {
      return false
    }
    this.sendMessage('ScenesService', 'makeSceneActive', iScene.id)
  }

  getCurrentScene() {
    this.sendMessage('ScenesService', 'activeSceneId')
      .then(aSceneId => {
        const aScene = this.scenes.find(scene => scene.id == aSceneId)
        if (!aScene) {
          return ''
        }
        return aScene.name
      })
  }

  setSourceMute(sourceName, mute) {
    const iSource = this.sources.find(source => source.name == sourceName)
    if (!iSource) {
      return false
    }
    this.sendMessage('SourcesService', 'setMuted', iSource.id, mute)
  }

  setSourceVisibility(sceneName, sourceName, visible) {
    const iScene = this.scenes.find(scene => scene.name == sceneName)
    if (!iScene) {
      return false
    }
    const iSource = iScene.nodes.find(source => source.name == sourceName)
    if (!iSource) {
      return false
    }
    this.sendMessage(iSource.resourceId, 'setVisibility', visible)
  }

  setTransition(transitionName) {
    return false
  }

  setTransitionDuration(transitionDuration) {
    return false
  }

}

module.exports = SLOBS