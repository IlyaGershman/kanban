import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import * as state from './state'
import { Board } from './Board'

class App extends Component {
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
      <Board
        columns={this.state.columns}
        moveCard={this.moveCard}
        addCard={this.addCard}
        addColumn={this.addColumn}
      />
    )
  }
}

export default DragDropContext(HTML5Backend)(App)