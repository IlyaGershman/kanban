import React, { Component } from 'react'
import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import * as state from './state'
import { Board } from './Board'

export default class App extends Component {
  state = state.initialState
  moveCard = (curPos, nextPos, columnOfOrigin) => {
    this.setState(state.moveCard(curPos, nextPos, columnOfOrigin))
  }

  render () {
    return (
      <DndProvider backend={Backend}>
        <Board columns={this.state.columns} moveCard={this.moveCard} />
      </DndProvider>
    )
  }
}
