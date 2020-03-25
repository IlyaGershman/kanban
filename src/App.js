import React, { Component } from 'react'
import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import * as state from './state'
import { Board } from './Board'

export default class App extends Component {
  state = state.initialState
  addColumn = title => {
    this.setState(state.addColumn(title))
  }

  addCard = (columnId, displayName) => {
    this.setState(state.addCard(columnId, displayName))
  }

  moveCard = (curPos, nextPos) => {
    this.setState(state.moveCard(curPos, nextPos))
  }

  render () {
    return (
      <DndProvider backend={Backend}>
        <Board
          columns={this.state.columns}
          moveCard={this.moveCard}
          addCard={this.addCard}
          addColumn={this.addColumn}
        />
      </DndProvider>
    )
  }
}
