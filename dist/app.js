;(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('et-dependency', factory)
  } else {
    var require = function() {}
    var module = {}
    var exports = {}
    factory(require, exports, module)
    global['et-dependency'] = module.exports
  }
})(window, function(require, exports, module) {
  'use strict'

  var EVENT_SPLITTER = /\s+|,/
  var EVENT_PREFIX = 'on-'

  function LOOP() {
  }

  function extend() {
    var len = arguments.length
    if (len <= 1) {
      return arguments[0]
    } else {
      var re = arguments[0] || {}
      for (var i = 1; i < len; i++) {
        var item = arguments[i]
        for (var key in item) {
          re[key] = item[key]
        }
      }
      return re
    }
  }

  function tp_create_parentHander(template, parentId, id) {
    if (parentId) {
      tp_append(template, parentId, id)
    } else {
      tp_setRoot(template, id)
    }
  }
  function tp_createElement(template, parentId, id, tag, attributes, properties) {
    template.elements[id] = document.createElement(tag)
    for (var attrName in attributes) {
      tp_setAttribute(template, id, attrName, attributes[attrName])
    }
    for (var propName in properties) {
      tp_setProperty(template, id, propName, properties[propName])
    }
    tp_create_parentHander(template, parentId, id)
  }

  function tp_createLine(template, parentId, id) {
    var elements = template.elements
    elements[id] = document.createComment(id)
    tp_create_parentHander(template, parentId, id)
  }

  function tp_createText(template, parentId, id, text) {
    var elements = template.elements
    elements[id] = document.createTextNode(text)
    tp_create_parentHander(template, parentId, id)
  }

  function tp_createTemplate(template, parentId, id, Constructor, context) {
    var elements = template.elements
    var et = elements[id] = new Constructor(context || template.context, template)
    if (!parentId) tp_setRoot(template, id)
    return et
  }

  function tp_getTemplate(template, id) {
    return template.elements[id]
  }

  function tp_getConditionTemplate(template, id, Constructor, context) {
    var et = tp_getTemplate(template, id)
    if (!et) {
      var elements = template.elements
      et = elements[id] = new Constructor(context || template.context, template)
    }
    return et
  }

  function tp_before(template, nextId, id) {
    var elements = template.elements
    var next = elements[nextId]
    var current = elements[id]

    if (next.isET)
      next = next.templateStart
    if (current.isET)
      current = current.get()
    if (next.parentNode) next.parentNode.insertBefore(current, next)
  }

  function tp_after(template, prevId, id) {
    var elements = template.elements
    var prev = elements[prevId]
    var current = elements[id]

    if (prev.isET)
      prev = prev.templateEnd
    if (current.isET)
      current = current.get()
    if (prev.parentNode) prev.parentNode.insertBefore(current, prev.nextSibling)
  }

  function tp_append(template, parentId, id) {
    var elements = template.elements
    var parent = elements[parentId]
    var current = elements[id]

    if (current.isET)
      current = current.get()
    parent.appendChild(current)
  }

  function tp_bind(template, id, eventString, callback) {
    var element = template.elements[id]
    if (!element.addEventListener) {
      // console.warning('The element has no addEventListener method', element)
      return
    }
    if (typeof callback !== 'function') {
      // console.warning('Could not find the listner handler', element)
      return
    }

    template._eventsLogger[id] = true
    var eventNames = eventString.split(EVENT_SPLITTER)
    for (var i = 0, len = eventNames.length; i < len; i++) {
      element.addEventListener(eventNames[i], callback, false)
    }
  }
  function tp_bindEventsByMap(template, id, eventsMap) {
    for (var eventName in eventsMap) {
      var callback = eventsMap[eventName]
      tp_bind(template, id, eventName, callback)
    }
  }

  function tp_getEventArguments(template, id, eventName) {
    return template.last['event_' + id + '_' + eventName] || []
  }

  function tp_saveEventArguments(template, id, eventName, args) {
    template.last['event_' + id + '_' + eventName] = args
  }

  function tp_isArrayEqual(arrayA, arrayB) {
    if (arrayA === arrayB) return true
    if (!arrayA && !arrayB) return true
    if (arrayA.length !== arrayB.length) return false

    for (var i = 0, len = arrayA.length; i < len; i++) {
      if (arrayA[i] !== arrayB[i]) return false
    }
    return true
  }

  function tp_html(template, id, html) {
    var elements = template.elements
    elements[id].innerHTML = html
  }

  function tp_text(template, id, text) {
    var elements = template.elements
    elements[id].textContent = text
  }

  function tp_setAttribute(template, id, attrName, attrValue) {
    var elements = template.elements
    if (attrName.indexOf(EVENT_PREFIX) === 0) {
      tp_bind(template, id, attrName.substr(EVENT_PREFIX.length), attrValue)
    }
    elements[id].setAttribute(attrName, attrValue)
  }

  function tp_getProperty(template, id, propName) {
    var elements = template.elements
    return elements[id][propName]
  }

  function tp_setProperty(template, id, propName, propValue) {
    var elements = template.elements
    elements[id][propName] = propValue
  }

  function tp_remove(template, id) {
    var elements = template.elements
    var element = elements[id]
    if (element && element.isET) {
      element.remove()
    } else if (element && element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }

  function tp_removeAttribute(template, id, attrName) {
    var elements = template.elements
    elements[id].removeAttribute(attrName)
  }

  function tp_removeAttributes(template, id) {
    var elements = template.elements
    var element = elements[id]
    for (var i = 2, len = arguments.length; i < len; i++) {
      element.removeAttribute(arguments[i])
    }
  }

  function tp_removeRoot(template, id) {
    template.roots[id] = false
  }

  function tp_setRoot(template, id, length) {
    if (length >= 0) {
      template.roots[id] = length
    } else {
      template.roots[id] = true
    }
  }

  function tp_setContext(template, key, value) {
    template.context[key] = value
  }

  var template = {
    isET: true,
    init: function init(context, parent) {
      this.context = context || {}
      this.parent = parent

      this.rootFrag = document.createDocumentFragment()
      this.templateStart = document.createComment('Start Template')
      this.templateEnd = document.createComment('End Template')

      this._eventsLogger = {} // 纪录哪些id的节点绑定了事件
      this.roots = {} // 记录某个id是不是root，如果纪录的是数字，那么认为是一个所属集合
      this.elements = {} // 记录所有的节点对象
      this.last = {} // 记录上一次判断是什么值，用于差异更新
      this.create()
    },
    get: function get() {
      var result = this.rootFrag
      var elements = this.elements
      var roots = this.roots
      var ids = Object.keys(roots).sort(function(a, b) {
        return (+a) - (+b)
        })

        result.appendChild(this.templateStart)
        for (var i = 0, len = ids.length; i < len; i++) {
          var id = ids[i]
          var isRoot = roots[id]
          if (!isRoot) continue

          if (isRoot === true) {
            var element = elements[id]
            if (element.isET) {
              result.appendChild(element.get())
            } else {
              result.appendChild(element)
            }
          } else {
            for (var j = 0, childrenLength = isRoot; j < childrenLength; j++) {
              var elementId = id + '_' + j
              var forElement = elements[elementId]
              if (forElement.isET) {
                result.appendChild(forElement.get())
              } else {
                result.appendChild(forElement)
              }
            }
          }
        }
        result.appendChild(this.templateEnd)
        return result
      },
      create: function create() {},
      update: function update() {},

      remove: function remove() {
        var roots = this.roots
        var ids = Object.keys(roots)

        if (this.templateStart.parentNode) {
          this.templateStart.parentNode.removeChild(this.templateStart)
        }
        if (this.templateEnd.parentNode) {
          this.templateEnd.parentNode.removeChild(this.templateEnd)
        }
        for (var i = 0, len = ids.length; i < len; i++) {
          var id = ids[i]
          var isRoot = roots[id]
          if (!isRoot) continue

          if (isRoot === true) {
            tp_remove(this, id)
          } else {
            for (var j = 0, childrenLength = isRoot; j < childrenLength; j++) {
              tp_remove(this, id + '_' + j)
            }
          }
        }
        return this
      },
      destroy: function destroy() {
        // remove elements
        this.remove()

        // off events
        var ids = Object.keys(this._eventsLogger)
        var elements = this.elements
        for (var i = 0, len = ids.length; i < len; i++) {
          var id = ids[i]
          var element = elements[id]
          if (!element.isET) element.removeEventListener()
          else element.destroy()
        }

        // destroy attributes
        var keys = Object.keys(this)
        for (var p = 0, len2 = keys.length; p < len2; p++) {
          var key = keys[p]
          var item = this[key]
          if (typeof item !== 'function') {
            this[key] = null
          } else {
            this[key] = LOOP
          }
        }
      }
    }

    function dep_createTemplate(prop) {
      var Template = function(context, parent) {
        this.init(context, parent)
      }
      extend(Template.prototype, template, prop)
      return Template
    }

    var et_dependency = Object.create({})

    et_dependency.tp_before = tp_before
    et_dependency.tp_after = tp_after
    et_dependency.tp_append = tp_append
    et_dependency.tp_bind = tp_bind
    et_dependency.tp_createElement = tp_createElement
    et_dependency.tp_createLine = tp_createLine
    et_dependency.tp_createText = tp_createText
    et_dependency.tp_createTemplate = tp_createTemplate
    et_dependency.tp_getTemplate = tp_getTemplate
    et_dependency.tp_getConditionTemplate = tp_getConditionTemplate
    et_dependency.tp_html = tp_html
    et_dependency.tp_remove = tp_remove
    et_dependency.tp_removeAttribute = tp_removeAttribute
    et_dependency.tp_removeAttributes = tp_removeAttributes
    et_dependency.tp_removeRoot = tp_removeRoot
    et_dependency.tp_setAttribute = tp_setAttribute
    et_dependency.tp_getProperty = tp_getProperty
    et_dependency.tp_setProperty = tp_setProperty
    et_dependency.tp_setRoot = tp_setRoot
    et_dependency.tp_text = tp_text
    et_dependency.tp_setContext = tp_setContext
    et_dependency.dep_createTemplate = dep_createTemplate
    et_dependency.tp_bindEventsByMap = tp_bindEventsByMap
    et_dependency.tp_getEventArguments = tp_getEventArguments
    et_dependency.tp_saveEventArguments = tp_saveEventArguments
    et_dependency.tp_isArrayEqual = tp_isArrayEqual

    module.exports = et_dependency

  });


;(function(global) {
  var _dep = global['et-dependency'];

  var _dep_createTemplate = _dep.dep_createTemplate;


  var _tp_createElement = _dep.tp_createElement;
  var _tp_createText = _dep.tp_createText;
  var _tp_bindEventsByMap = _dep.tp_bindEventsByMap;
  var _tp_createLine = _dep.tp_createLine;
  var _tp_getTemplate = _dep.tp_getTemplate;
  var _tp_getConditionTemplate = _dep.tp_getConditionTemplate;
  var _tp_after = _dep.tp_after;
  var _tp_getProperty = _dep.tp_getProperty;
  var _tp_setProperty = _dep.tp_setProperty;
  var _tp_remove = _dep.tp_remove;
  var _tp_text = _dep.tp_text;
  var _tp_setAttribute = _dep.tp_setAttribute;
  var _tp_getEventArguments = _dep.tp_getEventArguments;
  var _tp_isArrayEqual = _dep.tp_isArrayEqual;
  var _tp_saveEventArguments = _dep.tp_saveEventArguments;


  var Template_0 = _dep_createTemplate({
    create: function() {
      var _this = this;
      var it = _this.context;


      _tp_createElement(_this, null, 2, 'SECTION', {
        "class": "todoapp"
      });


      _tp_createElement(_this, 2, 4, 'HEADER', {
        "class": "header"
      });


      _tp_createElement(_this, 4, 6, 'H1');


      _tp_createText(_this, 6, 8, 'todos');


      _tp_createElement(_this, 4, 10, 'INPUT', {
        "class": "new-todo",
        "placeholder": "What needs to be done?",
        "autofocus": ""
      });

      _tp_bindEventsByMap(_this, 10, {

        'keyup': function($event) {
          it.onTodoKeyup($event);
        }
      });


      _tp_createLine(_this, 2, 11);


      _tp_createElement(_this, null, 76, 'FOOTER', {
        "class": "info"
      });


      _tp_createElement(_this, 76, 78, 'P');


      _tp_createText(_this, 78, 80, 'Double-click to edit a todo');


      _tp_createElement(_this, 76, 82, 'P');


      _tp_createText(_this, 82, 84, 'Created by ');


      _tp_createElement(_this, 82, 86, 'A', {
        "href": "https://github.com/suyu34"
      });


      _tp_createText(_this, 86, 88, 'suyu34');


      _tp_createElement(_this, 76, 90, 'P');


      _tp_createText(_this, 90, 92, 'Part of ');


      _tp_createElement(_this, 90, 94, 'A', {
        "href": "https://github.com/et-studio/et-template"
      });


      _tp_createText(_this, 94, 96, 'et-template');

    },

    update: function() {
      var _this = this;
      var _last = _this.last;
      var it = _this.context;


      var _index;
      var _templateId = _last[1];
      var _template = _tp_getTemplate(_this, _templateId);


      if (it.allLength) {
        _index = 0;
      } else {
        _index = 1;
      }


      if (_last[0] !== _index) {
        _last[0] = _index;

        if (_template) {
          _template.remove();

        }

        var _currentTemplateId;
        var _TemplateConstructor;

        if (it.allLength) {
          _currentTemplateId = 12;
          _TemplateConstructor = Template_12;
        } else {
          _currentTemplateId = null;
          _TemplateConstructor = null;
        }

        if (_TemplateConstructor) {
          _last[1] = _currentTemplateId;
          _template = _tp_getConditionTemplate(_this, _currentTemplateId, _TemplateConstructor);
          _tp_after(_this, 11, _currentTemplateId);

        } else {
          _last[1] = null;
          _template = null;
        }
      }
      if (_template) {
        _template.update();
      }

    }

  });

  var Template_12 = _dep_createTemplate({
    create: function() {
      var _this = this;
      var it = _this.context;


      _tp_createElement(_this, null, 14, 'SECTION', {
        "class": "main"
      });


      _tp_createElement(_this, 14, 16, 'INPUT', {
        "class": "toggle-all",
        "type": "checkbox"
      });

      _tp_bindEventsByMap(_this, 16, {

        'click': function() {
          it.api.toggleAll();
        }
      });


      _tp_createElement(_this, 14, 18, 'LABEL', {
        "for": "toggle-all"
      });


      _tp_createText(_this, 18, 20, 'Mark all as complete');


      _tp_createElement(_this, 14, 22, 'UL', {
        "class": "todo-list"
      });


      _tp_createLine(_this, 22, 23);


      _tp_createElement(_this, null, 40, 'FOOTER', {
        "class": "footer"
      });


      _tp_createElement(_this, 40, 42, 'SPAN', {
        "class": "todo-count"
      });


      _tp_createElement(_this, 42, 44, 'STRONG');


      _tp_createText(_this, 44, 46, '');


      _tp_createText(_this, 42, 48, ' item left');


      _tp_createElement(_this, 40, 50, 'UL', {
        "class": "filters"
      });


      _tp_createElement(_this, 50, 52, 'LI');


      _tp_createElement(_this, 52, 54, 'A', {
        "href": "#/"
      });


      _tp_createText(_this, 54, 56, 'All');


      _tp_createElement(_this, 50, 58, 'LI');


      _tp_createElement(_this, 58, 60, 'A', {
        "href": "#/active"
      });


      _tp_createText(_this, 60, 62, 'Active');


      _tp_createElement(_this, 50, 64, 'LI');


      _tp_createElement(_this, 64, 66, 'A', {
        "href": "#/completed"
      });


      _tp_createText(_this, 66, 68, 'Completed');


      _tp_createLine(_this, 40, 69);

    },

    update: function() {
      var _this = this;
      var _last = _this.last;
      var it = _this.context;



      var _tmp = (function() {
        if (it.isAllCompelted) {
          return 'checked';
        }
        return ''
      })();
      if (_tp_getProperty(_this, 16, 'checked') !== _tmp) {
        _tp_setProperty(_this, 16, 'checked', _tmp);
      }



      var _lastLength = _last[0] || 0;
      var _list = it.items || [];

      var _index = 0;
      var _len = _last[0] = _list.length;


      var _savedCache = [];
      for (; _index < _len; _index++) {
        var i = _index;
        var item = _list[_index];
        var _itemId = '24_' + item.id;

        var _template = _tp_getConditionTemplate(_this, _itemId, Template_24);

        var _isTemplateChanged = false;
        var _lastItemId = _last['for_item_id_' + '24_' + _index];
        _last['for_item_id_' + '24_' + _index] = _itemId;
        if (_lastItemId && _lastItemId !== _itemId) {
          var _lastTemplate = _tp_getTemplate(_this, _lastItemId);
          if (_lastTemplate && !~_savedCache.indexOf(_lastItemId)) _lastTemplate.remove();
          _isTemplateChanged = true;
        }

        if (_index >= _lastLength || _isTemplateChanged) {
          var _prevId = _index ? (_last['for_item_id_' + '24_' + (_index - 1)]) : 23;
          _tp_after(_this, _prevId, _itemId);
        }

        _savedCache.push(_itemId);
        _template.update(item);
      }
      for (; _index < _lastLength; _index++) {
        var _tmpItemId = _last['for_item_id_' + '24_' + _index];
        _last['for_item_id_' + '24_' + _index] = null;
        if (!~_savedCache.indexOf(_tmpItemId)) {
          _tp_remove(_this, _tmpItemId);
        }
      }



      var _tmp = (it.activeLength);
      if (_last[1] !== _tmp) {
        _last[1] = _tmp;
        _tp_text(_this, 46, _tmp);
      }



      var _tmp = (function() {
        if (it.routeIndex === 0) {
          return 'selected';
        }
        return ''
      })();
      if (_last[2] !== _tmp) {
        _last[2] = _tmp;
        _tp_setAttribute(_this, 54, 'class', _tmp);
      }




      var _tmp = (function() {
        if (it.routeIndex === 1) {
          return 'selected';
        }
        return ''
      })();
      if (_last[3] !== _tmp) {
        _last[3] = _tmp;
        _tp_setAttribute(_this, 60, 'class', _tmp);
      }




      var _tmp = (function() {
        if (it.routeIndex === 2) {
          return 'selected';
        }
        return ''
      })();
      if (_last[4] !== _tmp) {
        _last[4] = _tmp;
        _tp_setAttribute(_this, 66, 'class', _tmp);
      }



      var _index;
      var _templateId = _last[6];
      var _template = _tp_getTemplate(_this, _templateId);


      if ((it.allLength - it.activeLength) > 0) {
        _index = 0;
      } else {
        _index = 1;
      }


      if (_last[5] !== _index) {
        _last[5] = _index;

        if (_template) {
          _template.remove();

        }

        var _currentTemplateId;
        var _TemplateConstructor;

        if ((it.allLength - it.activeLength) > 0) {
          _currentTemplateId = 70;
          _TemplateConstructor = Template_70;
        } else {
          _currentTemplateId = null;
          _TemplateConstructor = null;
        }

        if (_TemplateConstructor) {
          _last[6] = _currentTemplateId;
          _template = _tp_getConditionTemplate(_this, _currentTemplateId, _TemplateConstructor);
          _tp_after(_this, 69, _currentTemplateId);

        } else {
          _last[6] = null;
          _template = null;
        }
      }
      if (_template) {
        _template.update();
      }

    }

  });

  var Template_24 = _dep_createTemplate({
    create: function() {
      var _this = this;
      var it = _this.context;


      _tp_createElement(_this, null, 26, 'LI');


      _tp_createElement(_this, 26, 28, 'DIV', {
        "class": "view"
      });


      _tp_createElement(_this, 28, 30, 'INPUT', {
        "class": "toggle",
        "type": "checkbox"
      });

      _tp_bindEventsByMap(_this, 30, {

        'click': function($event) {
          var _args = _tp_getEventArguments(_this, 30, 'click');
          it.api.toggle(_args[0]);
        }
      });


      _tp_createElement(_this, 28, 32, 'LABEL');

      _tp_bindEventsByMap(_this, 32, {

        'dblclick': function($event) {
          var _args = _tp_getEventArguments(_this, 32, 'dblclick');
          it.enterEditing(_args[0]);
        }
      });


      _tp_createText(_this, 32, 34, '');


      _tp_createElement(_this, 28, 36, 'BUTTON', {
        "class": "destroy"
      });

      _tp_bindEventsByMap(_this, 36, {

        'click': function($event) {
          var _args = _tp_getEventArguments(_this, 36, 'click');
          it.api.remove(_args[0]);
        }
      });


      _tp_createElement(_this, 26, 38, 'INPUT', {
        "class": "edit",
        "autofocus": ""
      });

      _tp_bindEventsByMap(_this, 38, {

        'blur': function($event) {
          var _args = _tp_getEventArguments(_this, 38, 'blur');
          it.save(_args[0], $event);
        },
        'keyup': function($event) {
          it.onEditKeyup($event);
        }
      });

    },

    update: function(item) {
      var _this = this;
      var _last = _this.last;
      var it = _this.context;



      var _tmp = (function() {
          if (item.isCompelted) {
            return 'completed';
          }
          return ''
        })() + ' ' + (function() {
          if (item.isEditing) {
            return 'editing';
          }
          return ''
        })();
      if (_last[0] !== _tmp) {
        _last[0] = _tmp;
        _tp_setAttribute(_this, 26, 'class', _tmp);
      }




      var _tmp = (item.id);
      if (_last[1] !== _tmp) {
        _last[1] = _tmp;
        _tp_setAttribute(_this, 30, 'data-id', _tmp);
      }

      var _tmp = (function() {
        if (item.isCompelted) {
          return 'checked';
        }
        return ''
      })();
      if (_tp_getProperty(_this, 30, 'checked') !== _tmp) {
        _tp_setProperty(_this, 30, 'checked', _tmp);
      }


      var _current = [item.id];
      var _saved = _tp_getEventArguments(_this, 30, 'click');
      if (!_tp_isArrayEqual(_saved, _current)) {
        _tp_saveEventArguments(_this, 30, 'click', _current);
      }



      var _tmp = (item.id);
      if (_last[2] !== _tmp) {
        _last[2] = _tmp;
        _tp_setAttribute(_this, 32, 'data-id', _tmp);
      }


      var _current = [item.id];
      var _saved = _tp_getEventArguments(_this, 32, 'dblclick');
      if (!_tp_isArrayEqual(_saved, _current)) {
        _tp_saveEventArguments(_this, 32, 'dblclick', _current);
      }


      var _tmp = (item.description);
      if (_last[3] !== _tmp) {
        _last[3] = _tmp;
        _tp_text(_this, 34, _tmp);
      }


      var _current = [item.id];
      var _saved = _tp_getEventArguments(_this, 36, 'click');
      if (!_tp_isArrayEqual(_saved, _current)) {
        _tp_saveEventArguments(_this, 36, 'click', _current);
      }



      var _tmp = (item.id);
      if (_last[4] !== _tmp) {
        _last[4] = _tmp;
        _tp_setAttribute(_this, 38, 'data-id', _tmp);
      }

      var _tmp = (item.description);
      if (_tp_getProperty(_this, 38, 'value') !== _tmp) {
        _tp_setProperty(_this, 38, 'value', _tmp);
      }


      var _current = [item.id, null];
      var _saved = _tp_getEventArguments(_this, 38, 'blur');
      if (!_tp_isArrayEqual(_saved, _current)) {
        _tp_saveEventArguments(_this, 38, 'blur', _current);
      }

    }

  });

  var Template_70 = _dep_createTemplate({
    create: function() {
      var _this = this;
      var it = _this.context;


      _tp_createElement(_this, null, 72, 'BUTTON', {
        "class": "clear-completed"
      });

      _tp_bindEventsByMap(_this, 72, {

        'click': function() {
          it.api.clearCompleted();
        }
      });


      _tp_createText(_this, 72, 74, 'Clear completed');

    }

  });

  global['Template'] = Template_0;
})(window);


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

    clearCompleted: function () {
      var items = datas.filter(function (item) {
        return !item.isCompelted
      })
      datas = items
      saveToStore()
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
