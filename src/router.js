'use strict'

;(function (global) {
  var events = {
    'init': [],
    'default': []
  }

  var router = {
    start: function () {
      console.log('router start')

      var _this = this
      global.addEventListener('hashchange', function (e) {
        var path = global.location.hash.substr(1)
        _this.trigger(path, e)
      })
      this.trigger('init')
      this.refresh()
    },
    on: function (path, callback) {
      if (!events[path]) events[path] = []
      events[path].push(callback)
    },
    off: function (path, fn) {
      if (!fn) {
        events[path] = []
      } else if (events[path]) {
        events[path] = events[path].filter(function (item) { return fn !== item })
      }
    },
    trigger: function (path, e) {
      if (!path) path = 'default'

      var list = events[path] || []
      for (var i = 0, len = list.length; i < len; i++) {
        var callback = list[i]
        callback(e)
      }
    },
    refresh: function () {
      var path = global.location.hash.substr(1)
      this.trigger(path, {isInit: true})
    }
  }

  global.addEventListener('load', function () {
    global.router.start()
  })

  global.router = router
})(window)
