import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import cn from 'classnames'
import _ from 'lodash'

export function CardHookNoDrop ({ moveCard, getCoordinates, title, id }) {
  const ref = useRef(null)
  const [{ isDragging }, drag] = useDrag({
    item: { id, type: 'Card' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })

  drag(ref)

  return (
    <div
      ref={ref}
      className={cn('Card', {
        'Card--dragging': isDragging
      })}
    >
      <div className='Card__title'>{title}</div>
    </div>
  )
}
