import React, { Component } from 'react'
import { Column } from './Column'
import { Card } from './Card'
import { DropPlaceholder } from './DropPlaceholder'

// 1) A map of (x, y) coordinates keyed by id
const coordinates = {}
// 2) Provide getter for quick id -> (x, y) lookup
const getCoordinates = (colId, id) => coordinates[colId][id]

// A Kanban Board!
export function Board ({ columns, moveCard, addCard, removeAddedByHover }) {
  return (
    <div className='Board'>
      {columns.map((column, x) => {
        coordinates[column.id] = coordinates[column.id]
          ? coordinates[column.id]
          : {}
        return (
          <Column
            key={column.id}
            title={column.title}
            // bind columnId as the 1st argument
            // addCard={addCard.bind(null, column.id)}
          >
            {column.cards.map((card, y) => {
              // 3) By setting coordinates in render
              // we avoid additional traversal and ensure that
              // getCoordinates(id) will always be current
              coordinates[column.id][card.id] = [x, y]
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
