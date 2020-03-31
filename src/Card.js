import React, { useRef, memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import cn from 'classnames'
import _ from 'lodash'

export const Card = memo(function ({ moveCard, column, title, id }) {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    item: { id, type: 'Card', title, columnOfOrigin: column },
    begin: monitor => {
      const i = monitor.getItem()
      console.log(i)
      return { node: { id, type: 'Card', title, columnOfOrigin: column } }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'Card',
    drop: () => {},
    options: {
      arePropsEqual: (props, otherProps) => {
        return props.id === otherProps.id
      }
    },
    hover: item => {
      if (item.id !== id && item.id !== `${id}_dragged`) {
        moveCard(item.id, id, item.columnOfOrigin)
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      key={id}
      className={cn('Card', {
        'Card--dragging': isDragging
      })}
    >
      <div className='Card__title'>{title}</div>
    </div>
  )
})

// const dt = DropTarget(
//   'Card',
//   {
//     hover (props, monitor) {
//       const draggingItem = monitor.getItem()
//       if (draggingItem.id !== props.id) {
//         props.moveCard(
//           props.getCoordinates(draggingItem.id),
//           props.getCoordinates(props.id)
//         )
//       }
//     }
//   },
//   connect => ({
//     connectDropTarget: connect.dropTarget()
//   })
// )

// const ds = DragSource(
//   'Card',
//   {
//     beginDrag (props) {
//       return {
//         id: props.id
//       }
//     },

//     isDragging (props, monitor) {
//       return props.id === monitor.getItem().id
//     }
//   },
//   (connect, monitor) => ({
//     connectDragSource: connect.dragSource(),
//     isDragging: monitor.isDragging()
//   })
// )
