import React, { Component } from 'react'
import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import * as state from './state'
import { Board } from './Board'
import 'react-sortable-tree/style.css'

export default class App extends Component {
  state = state.initialState // redux

  moveCard = (curPos, nextPos, columnOfOrigin) => {
    this.setState(state.moveCard(curPos, nextPos, columnOfOrigin))
  }

  addCard = (columnId, title) => {
    this.setState(state.addCard(columnId, title))
  }

  removeAddedByHover = card => {
    this.setState(state.removeAddedByHover(card))
  }

  onTreeDataChange = treeData => this.setState({ treeData })

  render () {
    return (
      <DndProvider backend={Backend}>
        <Board
          columns={this.state.columns}
          moveCard={this.moveCard}
          addCard={this.addCard}
          removeAddedByHover={this.removeAddedByHover}
          onTreeDataChange={this.onTreeDataChange}
          treeData={this.state.treeData}
        />
      </DndProvider>
    )
  }
}
