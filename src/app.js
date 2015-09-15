'use strict'

function start () {
  var $content = document.getElementById('content')
  var template = new window.Template()
  var api = window.api

  // api.create('Taste JavaScript')
  var items = api.get()
  var it = {items: items, allLength: items.length}
  template.update(it)
  console.log(it)
  $content.appendChild(template.get())
}

function bindEvents () {

}

window.onload = function () {
  start()
}
