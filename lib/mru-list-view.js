'use babel'

import MRUItemView from './mru-item-view'
import {CompositeDisposable} from 'atom'

class MRUListView extends HTMLElement {
  initialize(pane) {
    this.pane = pane
    this.subscribe()
    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false,
      class: 'tabs-mru-list'
    })
    this.classList.add("list-group")
  }

  subscribe() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      this.pane.onChooseNextMRUItem((item) => this.chooseNextMRU(item)))
    this.subscriptions.add(
      this.pane.onChooseLastMRUItem((item) => this.chooseLastMRU(item)))
    this.subscriptions.add(
      this.pane.onDoneChoosingMRUItem(() => this.stopChoosingMRU()))
    this.subscriptions.add(
      this.pane.onDidDestroy(() => this.unsubscribe()))
  }

  unsubscribe() {
    this.subscriptions.dispose()
  }

  chooseNextMRU(selectedItem) {
    this.show(selectedItem)
  }

  chooseLastMRU(selectedItem) {
    this.show(selectedItem)
  }

  stopChoosingMRU() {
    this.hide()
  }

  show(selectedItem) {
    if (!this.panel.visible) {
      console.log('showing')
      this.buildListView(selectedItem)
      this.panel.show()
    }
    else {
      this.updateSelectedItem(selectedItem)
    }
  }

  hide() {
    if (this.panel.visible) {
      console.log('hiding')
      this.panel.hide()
    }
  }

  updateSelectedItem(selectedItem) {
    for (let itemView of this.children) {
      if (itemView.item === selectedItem)
        itemView.select()
      else
        itemView.unselect()
    }
  }

  buildListView(selectedItem) {
    // Ian TODO: don't rebuild from scratch every time obvs
    while (this.firstChild)
      this.removeChild(this.firstChild)
    //for (let item of this.pane.itemStack) {
    for (let i = this.pane.itemStack.length-1; i >= 0; i--) {
      let item = this.pane.itemStack[i]
      let itemView = new MRUItemView()
      itemView.initialize(this, item)
      this.appendChild(itemView)
      console.log ("this: " + item.getTitle())
      console.log ("selected: " + item.getTitle())
      if (item === selectedItem)
        itemView.select()
    }
  }

}

module.exports = document.registerElement("tabs-mru-list", {prototype: MRUListView.prototype, extends: "ol"})
