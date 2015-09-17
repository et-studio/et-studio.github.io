'use strict'

;(function (global) {
  function saveToStore () {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(datas))
    api.trigger('change')
  }
  function cloneArray (arr) {
    var results = []
    for (var i = 0, len = arr.length; i < len; i++) {
      var item = arr[i]
      var result = {}
      for (var key in item) {
        result[key] = item[key]
      }
      results.push(result)
    }
    return results
  }

  var STORE_KEY = 'et-todomvc'
  var datas = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
  var currentId = 0
  if (datas.length > 0) currentId = datas[datas.length - 1].id
  var events = {}

  var api = {
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
    create: function (description) {
      if (!description) return // 排除 null 和 undefined
      description = description.trim()
      if (!description) return // 排除空白值

      var todo = {
        id: ++currentId,
        description: description,
        isCompelted: false,
        createTime: new Date().valueOf()
      }
      datas.push(todo)
      saveToStore()
      return todo
    },
    remove: function (id) {
      var items = datas.filter(function (item) {
        return item.id !== id
      })
      datas = items
      saveToStore()
    },
    update: function (id, description) {
      var todo = datas.find(function (item) {
        return item.id === id
      })
      if (todo && todo.description !== description) {
        todo.description = description
        saveToStore()
      }
    },
    toggle: function (id) {
      var todo = datas.find(function (item) {
        return item.id === id
      })
      if (todo) {
        todo.isCompelted = !todo.isCompelted
        saveToStore()
      }
    },
    toggleAll: function () {
      this.setAll('isCompelted', !this.isAllCompelted())
    },
    isAllCompelted: function () {
      return datas.every(function (item) {
        return item.isCompelted
      })
    },

    setAll: function (key, value) {
      datas.map(function (item) {
        item[key] = value
      })
      saveToStore()
    },

    getAllLength: function () {
      return datas.length
    },
    getActiveLength: function () {
      var items = datas.filter(function (item) {
        return !item.isCompelted
      })
      return items.length
    },
    getCompeltedLength: function () {
      var items = datas.filter(function (item) {
        return item.isCompelted
      })
      return items.length
    },

    filteItems: function (filter) {
      return datas.filter()
    },
    getAllTodos: function () {
      return cloneArray(datas)
    },
    getActiveTodos: function () {
      var items = datas.filter(function (item) {
        return !item.isCompelted
      })
      return cloneArray(items)
    },
    getCompeltedTodos: function () {
      var items = datas.filter(function (item) {
        return item.isCompelted
      })
      return cloneArray(items)
    }
  }
  global.api = api
})(window)
