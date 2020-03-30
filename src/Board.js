import React, { Component } from 'react'
import { Column } from './Column'
import { Card } from './Card'
import { DropPlaceholder } from './DropPlaceholder'

// A Kanban Board!
export function Board ({ columns, moveCard, addCard, removeAddedByHover }) {
  return (
    <div className='Board'>
      {columns.map((column, x) => {
        return (
          <Column key={column.id} title={column.title}>
            {column.cards.map((card, y) => {
              return (
                <Card
                  key={card.id}
                  title={card.displayName}
                  column={column}
                  // Props required for drag and drop
                  id={card.id}
                  getCoordinates={getCoordinates}
                  moveCard={moveCard}
                />
              )
            })}
            <DropPlaceholder
              removeAddedByHover={removeAddedByHover}
              id={column.id}
              // Props required for drag and drop
              getCoordinates={getCoordinates}
              addCard={addCard.bind(null, x)}
            />
          </Column>
        )
      })}
    </div>
  )
}
