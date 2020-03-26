import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import cn from 'classnames'
import _ from 'lodash'

export function DropPlaceholder ({ addCard, removeAddedByHover, id }) {
  const ref = useRef(null)

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'Card',
    drop: item => {
      addCard(`${item.title} --added`)
    },
    options: {
      arePropsEqual: (props, otherProps) => {
        return props.id === otherProps.id
      }
    },
    hover: item => {
      removeAddedByHover(item.id)
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  })

  drop(ref)

  return (
    <div
      ref={ref}
      key={id}
      className={cn('DropPlaceholder', {
        'DropPlaceholder--isOver': isOver
      })}
    ></div>
  )
}

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
