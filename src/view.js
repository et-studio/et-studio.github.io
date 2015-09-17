'use strict'

;(function (global) {
  var $ = global.$
  var api = global.api
  var Template = global.Template

  var view = {
    content: null,
    template: null,
    routeIndex: 0,
    init: function () {
      var content = document.getElementById('content')
      var template = new Template()
      content.appendChild(template.get())

      this.content = content
      this.template = template

      var _this = this
      var $content = $(content)

      api.on('change', function () {
        _this.render()
      })
      // TODO:
      // 当前模板没有实现事件代理，所以先使用jQuery进行事件代理
      // 这里需要设计的地方还是蛮多的
      $content.on('click', '.toggle-all', function (e) {
        api.toggleAll()
      })
      $content.on('click', '.destroy', function (e) {
        var id = +e.currentTarget.getAttribute('data-id')
        api.remove(id)
      })
      $content.on('click', '.toggle', function (e) {
        var id = +e.currentTarget.getAttribute('data-id')
        api.toggle(id)
      })
      $content.on('keyup', '.new-todo', function (e) {
        if (e.keyCode === 13) {
          var description = e.currentTarget.value
          e.currentTarget.value = ''
          api.create(description)
        }
      })
      $content.on('dblclick', '.view label', function (e) {
        var id = +e.currentTarget.getAttribute('data-id')
        _this.toggleEdit(id)
      })
      $content.on('blur', '.edit', function (e) {
        var id = +e.currentTarget.getAttribute('data-id')
        var description = e.currentTarget.value
        e.currentTarget.value = ''
        api.update(id, description)
        _this.cancelEditing()
      })
      $content.on('keyup', '.edit', function (e) {
        if (e.keyCode === 13) {
          $(this).blur()
        }
      })
    },
    toggleEdit: function (id) {
      if (this.editingId === id) {
        this.cancelEditing()
      } else {
        this.enterEditing(id)
      }
    },
    enterEditing: function (id) {
      this.editingId = id
      this.render()
    },
    cancelEditing: function () {
      this.editingId = null
      this.render()
    },
    getItems: function () {
      var items
      switch (this.routeIndex) {
        case 1:
          items = api.getActiveTodos()
          break
        case 2:
          items = api.getCompeltedTodos()
          break
        default:
          items = api.getAllTodos()
      }
      if (this.editingId) {
        var editingId = this.editingId
        items.some(function (item) {
          var isEditing = item.id === editingId
          item.isEditing = isEditing
          return isEditing
        })
      }
      return items
    },
    render: function () {
      var it = {
        routeIndex: this.routeIndex,
        items: this.getItems(),
        allLength: api.getAllLength(),
        activeLength: api.getActiveLength(),
        isAllCompelted: api.isAllCompelted()
      }
      this.template.update(it)

      // TODO:
      // 因为没有自动聚焦的功能，所以先用jQuery实现
      var $focus = $(this.content).find('.editing .edit')
      if ($focus.length) $focus.focus()
    },
    setIndex: function (index) {
      this.routeIndex = index
      this.render()
    }
  }

  global.view = view
})(window)
