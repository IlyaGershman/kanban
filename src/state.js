import _ from 'lodash'
import { uuid } from 'uuidv4'
import { assetsTree } from './mocks/MOCK_DATA'
import produce from 'immer'

let _columnId = 0
let _cardId = 0
let LEN = 10

const CARD = 'card'
const COLUMN = 'column'
const columnsData = [
  { title: 'TODO', emoji: '🔥' },
  { title: 'Doing', emoji: '🥕' },
  { title: 'Done', emoji: '🍄' } //⤵️⤴️
]

const generateCard = card => ({ ...card, id: uuid(CARD) })
const detectDuplicates = (id, state) => {
  let changes = {}
  state.columns.forEach((column, x) => {
    column.cards.forEach((card, y) => {
      if (card.id == id && column.allowRemoveElements) changes[x] = y
    })
  })
  return changes
}

export const initialState = {
  columns: columnsData.map(({ title, emoji }, i) => ({
    id: uuid(COLUMN),
    title,
    emoji,
    allowRemoveElements: title !== 'TODO' && title !== 'Done',
    cards:
      // i === 0
      //   ? assetsTree.slice(0, 200)
      //   :
      Array.from({ length: LEN }).map(() => ({
        id: uuid(CARD),
        displayName: `${emoji} Card ${_cardId++ % LEN}`
      }))
  }))
}

export const moveCard = (
  [curX, curY],
  [destX, destY],
  columnOfOrigin
) => state => {
  // 1) Stash card so we can insert at destination
  console.log(`curX: ${curX}, curY: ${curY}, destX: ${destX}, destY: ${destY}`)
  const card = state.columns[curX].cards[curY]
  const column = state.columns[curX]
  const sameColumnOfOrigin = columnOfOrigin.id === column.id
  const { allowRemoveElements } = columnOfOrigin
  const sameColumn = curX === destX
  // help functions
  const switchPlaces = draft => {
    draft.columns[curX].cards.splice(curY, 1) // remove
    draft.columns[destX].cards.splice(destY, 0, card) // replace
  }

  const putNew = draft => {
    console.log('putNew')
    draft.columns[destX].cards.splice(destY, 0, card) // replace
  }

  const switchPlacesAndRemoveDuplicates = draft => {
    console.log('switchPlacesAndRemoveDuplicates')

    // find duplicates and remove them
    let changes = Object.entries(detectDuplicates(card.id, state))
    if (changes.length > 0) {
      console.log(changes)
      changes.forEach(([x, y]) => {
        draft.columns[x].cards.splice(y, 1)
      })
    }
    const destCol = draft.columns[destX]
    if (destCol.allowRemoveElements) destCol.cards.splice(destY, 0, card) // replace
  }

  console.log('=======================================')

  console.log(
    `
    dragging: ${card.id}
    sameColumnOfOrigin:  ${sameColumnOfOrigin}
    sameColumn: ${sameColumn}
    allowRemoveElementsAtOrigin: ${allowRemoveElements}
    `
  )

  // the idea is to create state machine with all the cases and to analyze
  return produce(state, draft => {
    switch (true) {
      case sameColumnOfOrigin && sameColumn && allowRemoveElements:
      case sameColumnOfOrigin && sameColumn && !allowRemoveElements:
      case sameColumnOfOrigin && !sameColumn && allowRemoveElements:
      case !sameColumnOfOrigin && sameColumn && allowRemoveElements:
      case !sameColumnOfOrigin && sameColumn && !allowRemoveElements:
      case !sameColumnOfOrigin && !sameColumn && allowRemoveElements:
        switchPlaces(draft)
        break
      case !sameColumnOfOrigin && !sameColumn && !allowRemoveElements:
        switchPlacesAndRemoveDuplicates(draft)
        break
      case sameColumnOfOrigin && !sameColumn && !allowRemoveElements:
        putNew(draft, generateCard(card))
        break

      default:
        break
    }
  })
}

export const addCard = (columnId, displayName = 'Card?') => state => {
  console.log('addCard')
  return produce(state, draft => {
    draft.columns[columnId].cards.push(generateCard({ displayName }))
  })
}

export const removeAddedByHover = cardId => state => {
  return produce(state, draft => {
    let changes = Object.entries(detectDuplicates(cardId, state))

    if (changes.length > 0) {
      changes.forEach(([x, y]) => {
        draft.columns[x].cards.splice(y, 1)
      })
    }
  })
}
