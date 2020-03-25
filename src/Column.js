import React, { memo } from 'react'
import { TextInput } from './TextInput'

export const Column = memo(function (props) {
  return (
    <div className='Column'>
      <div className='Column__title'>{props.title}</div>
      {props.children}
      {/* <TextInput onSubmit={props.addCard} placeholder='Add card...' /> */}
    </div>
  )
})
