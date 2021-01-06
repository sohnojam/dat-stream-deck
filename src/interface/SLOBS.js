const SockJS = require('sockjs')

class SLOBS {

  constructor(controller, config) {

    this.controller = controller
    this.config = config

    this.socket = null
    this.currentRequestId = 0

    this.requests = {}
    
    this.scenes = []
    this.sources = []

  }

  handleConnectionOpened() {
    console.log('connected (SLOBS)')
    this.socket.request('TcpServerService', 'auth', this.config.SLOBS.token)
      .then(() => {
        this.handleAuthSuccess()
      }).catch(error => {
        this.handleAuthFailure()
      })
  }

  handleConnectionClosed() {
    console.log('disconnected (SLOBS)')
    this.controller.setState('init')
  }

  handleAuthSuccess() {
    console.log('authenticated (SLOBS)')
    this.controller.setState('main')

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


  connect() {
    this.socket = new SockJS(this.config.SLOBS.address)

    this.socket.onopen = () => this.handleConnectionOpened()
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