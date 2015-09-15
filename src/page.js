
(function(global){
  var module = {}
  var exports = {}
  function require (key) {
    return global[key]
  }

  

'use strict'

var _dep = require('et-dependency')
var _prototype = _dep.template
var _extend = _dep.extend



  

var _tp_createElement = _dep.tp_createElement
var _tp_createText = _dep.tp_createText
var _tp_bind = _dep.tp_bind
var _tp_createLine = _dep.tp_createLine
var _tp_createFragment = _dep.tp_createFragment
var _tp_setRoot = _dep.tp_setRoot
var _tp_append = _dep.tp_append
var _tp_after = _dep.tp_after
var _tp_getTemplate = _dep.tp_getTemplate
var _tp_remove = _dep.tp_remove
var _tp_text = _dep.tp_text
var _tp_setAttribute = _dep.tp_setAttribute
var _tp_getProperty = _dep.tp_getProperty
var _tp_setProperty = _dep.tp_setProperty

function Template_0 (options) {
    this.init(options)
  }

  function Template_24 (options) {
    this.init(options)
  }

    _extend(Template_0.prototype, _prototype, {
      create: function create () {
        var _elements = this.elements

          var _scope = this

        
  _tp_createElement(_elements, 2, 'SECTION', {
  "class": "todoapp"
})


  _tp_createElement(_elements, 4, 'HEADER', {
  "class": "header"
})


  _tp_createElement(_elements, 6, 'H1')


_tp_createText(_elements, 8, 'todos')


  _tp_createElement(_elements, 10, 'INPUT', {
  "class": "new-todo",
  "placeholder": "What needs to be done?",
  "autofocus": ""
})

  _tp_bind(this, 10, 'change keyup', function (e) {

      _scope.trigger('et-model', 'description', e.target.value, e)

  })


_tp_createLine(_elements, 11)
_tp_createFragment(_elements, 12)


  _tp_createElement(_elements, 14, 'SECTION', {
  "class": "main"
})


  _tp_createElement(_elements, 16, 'INPUT', {
  "class": "toggle-all",
  "type": "checkbox"
})


  _tp_createElement(_elements, 18, 'LABEL', {
  "for": "toggle-all"
})


_tp_createText(_elements, 20, 'Mark all as complete')


  _tp_createElement(_elements, 22, 'UL', {
  "class": "todo-list"
})


_tp_createLine(_elements, 23)
_tp_createFragment(_elements, 24)


  _tp_createElement(_elements, 40, 'FOOTER', {
  "class": "footer"
})


  _tp_createElement(_elements, 42, 'SPAN', {
  "class": "todo-count"
})


  _tp_createElement(_elements, 44, 'STRONG')


_tp_createText(_elements, 46, '')


_tp_createText(_elements, 48, 'item left')


  _tp_createElement(_elements, 50, 'UL', {
  "class": "filters"
})


  _tp_createElement(_elements, 52, 'LI')


  _tp_createElement(_elements, 54, 'A', {
  "href": "#/"
})


_tp_createText(_elements, 56, 'All')


  _tp_createElement(_elements, 58, 'LI')


  _tp_createElement(_elements, 60, 'A', {
  "href": "#/active"
})


_tp_createText(_elements, 62, 'Active')


  _tp_createElement(_elements, 64, 'LI')


  _tp_createElement(_elements, 66, 'A', {
  "href": "#/completed"
})


_tp_createText(_elements, 68, 'Completed')


_tp_createLine(_elements, 69)
_tp_createFragment(_elements, 70)


  _tp_createElement(_elements, 72, 'BUTTON', {
  "class": "clear-completed"
})


_tp_createText(_elements, 74, 'Clear completed')


  _tp_createElement(_elements, 76, 'FOOTER', {
  "class": "info"
})


  _tp_createElement(_elements, 78, 'P')


_tp_createText(_elements, 80, 'Double-click to edit a todo')


  _tp_createElement(_elements, 82, 'P')


_tp_createText(_elements, 84, 'Created by ')


  _tp_createElement(_elements, 86, 'A', {
  "href": "https://github.com/suyu34"
})


_tp_createText(_elements, 88, 'suyu34')


  _tp_createElement(_elements, 90, 'P')


_tp_createText(_elements, 92, 'Part of ')


  _tp_createElement(_elements, 94, 'A', {
  "href": "https://github.com/et-studio/et-template"
})


_tp_createText(_elements, 96, 'et-template')

        
  _tp_setRoot(this, 2)


  _tp_append(_elements, 2, 4)


  _tp_append(_elements, 4, 6)


  _tp_append(_elements, 6, 8)


  _tp_append(_elements, 4, 10)


  _tp_append(_elements, 2, 11)


  _tp_setRoot(this, 76)


  _tp_append(_elements, 76, 78)


  _tp_append(_elements, 78, 80)


  _tp_append(_elements, 76, 82)


  _tp_append(_elements, 82, 84)


  _tp_append(_elements, 82, 86)


  _tp_append(_elements, 86, 88)


  _tp_append(_elements, 76, 90)


  _tp_append(_elements, 90, 92)


  _tp_append(_elements, 90, 94)


  _tp_append(_elements, 94, 96)

      },

        update: function update (it) {
          var _elements = this.elements
          var _last = this.last

          
  if (it.allLength) {
    if (_last[6] !== 0) {
      _last[6] = 0

      
      
  _tp_append(_elements, 12, 14)


  _tp_append(_elements, 14, 16)


  _tp_append(_elements, 14, 18)


  _tp_append(_elements, 18, 20)


  _tp_append(_elements, 14, 22)


  _tp_append(_elements, 22, 23)


  _tp_append(_elements, 12, 40)


  _tp_append(_elements, 40, 42)


  _tp_append(_elements, 42, 44)


  _tp_append(_elements, 44, 46)


  _tp_append(_elements, 42, 48)


  _tp_append(_elements, 40, 50)


  _tp_append(_elements, 50, 52)


  _tp_append(_elements, 52, 54)


  _tp_append(_elements, 54, 56)


  _tp_append(_elements, 50, 58)


  _tp_append(_elements, 58, 60)


  _tp_append(_elements, 60, 62)


  _tp_append(_elements, 50, 64)


  _tp_append(_elements, 64, 66)


  _tp_append(_elements, 66, 68)


  _tp_append(_elements, 40, 69)


        _tp_after(_elements, 11, 12)

    }
    
var _lastLength = _last[0] || 0
var _list = it.items || []

var _index = 0
var _len = _last[0] = _list.length
for (; _index < _len; _index++) {
  var i = _index
  var item = _list[_index]

  var _template = _tp_getTemplate(_elements, '24_' + _index, Template_24, this.options)
  if (_index >= _lastLength) {
    _tp_append(_elements, 24, '24_' + _index)
  }
  _template.update(it, item)
}
for (; _index < _lastLength; _index++) {
  _tp_remove(_elements, '24_' + _index)
}
_tp_after(_elements, 23, 24)


var _tmp = it.todosLength
if (_last[1] !== _tmp) {
  _last[1] = _tmp
  _tp_text(_elements, 46, _tmp)
}


  
      var _tmp = (function () {
      if (it.routeIndex === 0) {
            return 'selected'
          }
      return ''
    })()
      if (_last[2] !== _tmp) {
        _last[2] = _tmp
        _tp_setAttribute(_elements, 54, 'class', _tmp)
      }



  
      var _tmp = (function () {
      if (it.routeIndex === 1) {
            return 'selected'
          }
      return ''
    })()
      if (_last[3] !== _tmp) {
        _last[3] = _tmp
        _tp_setAttribute(_elements, 60, 'class', _tmp)
      }



  
      var _tmp = (function () {
      if (it.routeIndex === 2) {
            return 'selected'
          }
      return ''
    })()
      if (_last[4] !== _tmp) {
        _last[4] = _tmp
        _tp_setAttribute(_elements, 66, 'class', _tmp)
      }



  }

  else  {
    if (_last[6] !== 1) {
      _last[6] = 1

      
_tp_remove(_elements, 14)


_tp_remove(_elements, 40)

      

    }
    
  }

        }

    })

    _extend(Template_24.prototype, _prototype, {
      create: function create () {
        var _elements = this.elements

          var _scope = this

        
  _tp_createElement(_elements, 26, 'LI')


  _tp_createElement(_elements, 28, 'DIV', {
  "class": "view"
})


  _tp_createElement(_elements, 30, 'INPUT', {
  "class": "toggle",
  "type": "checkbox",
  "checked": ""
})


  _tp_createElement(_elements, 32, 'LABEL')


_tp_createText(_elements, 34, '')


  _tp_createElement(_elements, 36, 'BUTTON', {
  "class": "destroy"
})


  _tp_createElement(_elements, 38, 'INPUT', {
  "class": "edit"
})

        
  _tp_setRoot(this, 26)


  _tp_append(_elements, 26, 28)


  _tp_append(_elements, 28, 30)


  _tp_append(_elements, 28, 32)


  _tp_append(_elements, 32, 34)


  _tp_append(_elements, 28, 36)


  _tp_append(_elements, 26, 38)

      },

        update: function update (it, item) {
          var _elements = this.elements
          var _last = this.last

          
  
      var _tmp = (function () {
      if (it.isCompelted) {
            return 'completed'
          }
      return ''
    })() + ' ' + (function () {
      if (it.isEditing) {
            return 'editing'
          }
      return ''
    })()
      if (_last[3] !== _tmp) {
        _last[3] = _tmp
        _tp_setAttribute(_elements, 26, 'class', _tmp)
      }



  
      var _tmp = item.id
      if (_last[0] !== _tmp) {
        _last[0] = _tmp
        _tp_setAttribute(_elements, 30, 'data-id', _tmp)
      }



var _tmp = item.description
if (_last[1] !== _tmp) {
  _last[1] = _tmp
  _tp_text(_elements, 34, _tmp)
}


  
      var _tmp = item.id
      if (_last[2] !== _tmp) {
        _last[2] = _tmp
        _tp_setAttribute(_elements, 38, 'data-id', _tmp)
      }

      var _tmp = item.description
      if (_tp_getProperty(_elements, 38, 'value') !== _tmp) {
        _tp_setProperty(_elements, 38, 'value', _tmp)
      }


        }

    })

module.exports = exports['default'] = Template_0


  global.Template = module.exports
})(window)
