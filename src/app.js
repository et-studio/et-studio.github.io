'use strict'

;(function (global) {
  var router = global.router
  var view = global.view

  router.on('init', function () {
    view.init()
  })
  router.on('default', function () {
    view.setIndex(0)
  })
  router.on('/', function () {
    view.setIndex(0)
  })
  router.on('/active', function () {
    view.setIndex(1)
  })
  router.on('/completed', function () {
    view.setIndex(2)
  })
})(window)
