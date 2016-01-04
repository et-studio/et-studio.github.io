'use strict'

;(function (global) {
  var $ = global.$
  var api = global.api
  var Template = global.Template

  var view = {
    routeIndex: 0,
    items: null,
    allLength: null,
    activeLength: null,
    isAllCompelted: null,
    api: api,

    init: function () {
      var content = document.getElementById('content')
      this.template = new Template(this)
      content.appendChild(this.template.get())

      var _this = this
      this.render()
      api.on('change', function () { _this.render() })
    },
    render: function () {
      switch (this.routeIndex) {
        case 1:
          this.items = api.getActiveTodos()
          break
        case 2:
          this.items = api.getCompeltedTodos()
          break
        default:
          this.items = api.getAllTodos()
      }
      if (this.editingId) {
        var editingId = this.editingId
        this.items.some(function (item) {
          var isEditing = item.id === editingId
          item.isEditing = isEditing
          return isEditing
        })
      }
      this.allLength = api.getAllLength()
      this.activeLength = api.getActiveLength()
      this.isAllCompelted = api.isAllCompelted()
      this.template.update()

      $input = document.querySelector('.editing .edit')
      if ($input) {
        $input.focus()
      }
    },
    setIndex: function (index) {
      this.routeIndex = index
      this.render()
    },

    // control methods
    // TODO: 目前没有提供键盘事件
    onTodoKeyup: function (e) {
      if (e.keyCode === 13) {
        var description = e.currentTarget.value
        e.currentTarget.value = ''
        api.create(description)
      }
    },
    save: function (id, e) {
      var description = e.currentTarget.value
      this.editingId = null
      api.update(id, description)
      this.render()
    },
    onEditKeyup: function (e) {
      if (e.keyCode === 13) {
        $(this).blur()
      }
    },
    enterEditing: function (id) {
      this.editingId = id
      this.render()
    }
  }

  global.view = view
})(window)
