
(function (global) {
  var STORE_KEY = 'et-todomvc'
  var datas = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
  var currentId = 0
  if (datas.length > 0) currentId = datas[datas.length - 1].id

  function saveToStore () {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(datas))
  }

  var api = {
    create: function (description) {
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
    setAll: function (isCompelted) {
      datas.map(function (item) {
        item.isCompelted = isCompelted
      })
      saveToStore()
    },
    redoAll: function () {
      this.setAll(false)
    },
    completeAll: function () {
      this.setAll(true)
    },
    get: function () {
      return datas
    }
  }
  global.api = api
})(window)
