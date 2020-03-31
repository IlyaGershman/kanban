import React, { Component } from 'react'
import { Column } from './Column'
import { Card } from './Card'
import { DropPlaceholder } from './DropPlaceholder'
// import SortableTree from 'react-sortable-tree'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// A Kanban Board!
export function Board ({
  columns,
  moveCard,
  addCard,
  removeAddedByHover,
  onTreeDataChange,
  treeData
}) {
  console.log(treeData)
  return (
    <div className='Board'>
      {columns.map((column, x) => {
        return (
          <Column key={column.id} title={column.title}>
            {column.cards.map((card, y) => {
              return (
                <Card
                  key={card.id}
                  title={card.title}
                  column={column}
                  // Props required for drag and drop
                  id={card.id}
                  moveCard={moveCard}
                />
              )
            })}
            <DropPlaceholder
              removeAddedByHover={removeAddedByHover}
              id={column.id}
              // Props required for drag and drop
              addCard={addCard.bind(null, x)}
            />
          </Column>
        )
      })}
      <div className='react-sortable-container'>
        <SortableTree
          treeData={treeData}
          onChange={onTreeDataChange}
          dndType={'Card'}
        />
      </div>
    </div>
  )
}
