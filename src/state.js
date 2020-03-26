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
export const initialState = {
  columns: columnsData.map(({ title, emoji }, i) => ({
    id: uuid(COLUMN),
    title,
    emoji,
    allowRemoveElements: title !== 'TODO',
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

const generateCard = card => ({ ...card, id: uuid(CARD) })

export const moveCard = (
  [curX, curY],
  [destX, destY],
  columnOfOrigin
) => state => {
  // 1) Stash card so we can insert at destination
  // console.log('curX, curY, destX, destY', curX, curY, destX, destY)
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

  const putNewCard = draft => {
    console.log('putNewCard')
    draft.columns[destX].cards.splice(destY, 0, card) // replace
  }

  const switchPlacesAndRemoveDuplicates = draft => {
    console.log('switchPlacesAndRemoveDuplicates')
    const duplicateIndex = draft.columns[destX].cards.findIndex(
      e => e.id === card.id
    )

    if (duplicateIndex > -1) {
      const colIndex = draft.columns.findIndex(c => c.id === columnOfOrigin.id)
      console.log(duplicateIndex, colIndex)
      draft.columns[colIndex].cards.splice(curY, 1) // remove
    }
    draft.columns[curX].cards.splice(curY, 1) // remove
    draft.columns[destX].cards.splice(destY, 0, card) // replace
  }

  console.log('=======================================')
  // the idea is to create state machine with all the cases and to analyze
  return produce(state, draft => {
    switch (true) {
      case sameColumnOfOrigin && sameColumn && allowRemoveElements:
        switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [0, 0, 0])
        break
      case !sameColumnOfOrigin && !sameColumn && !allowRemoveElements:
        // switching between columns which remove disabled from origin column
        switchPlacesAndRemoveDuplicates(draft)
        console.log('origin | current | canRemoveFromOrigin', [1, 1, 1])
        break
      case sameColumnOfOrigin && sameColumn && !allowRemoveElements:
        switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [0, 0, 1])
        break
      case sameColumnOfOrigin && !sameColumn && allowRemoveElements:
        switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [0, 1, 0])
        break
      case sameColumnOfOrigin && !sameColumn && !allowRemoveElements:
        // item was dropped from origin to another column
        putNewCard(draft, generateCard(card))
        // switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [0, 1, 1])
        console.log('item was dropped from origin to another column')
        break
      case !sameColumnOfOrigin && sameColumn && allowRemoveElements:
        switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [1, 0, 0])
        break
      case !sameColumnOfOrigin && sameColumn && !allowRemoveElements:
        switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [1, 0, 1])
        break
      case !sameColumnOfOrigin && !sameColumn && allowRemoveElements:
        switchPlaces(draft)
        console.log('origin | current | canRemoveFromOrigin', [1, 1, 0])
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
  produce(state, draft => {
    let changes = {}
    state.columns.forEach((column, x) => {
      column.cards.forEach((card, y) => {
        if (card.id == cardId) changes[x] = y
      })
    })

    Object.entries(changes).forEach(([key, value], i) => {
      console.log(key, value)
    })

    console.log(container)
    console.log(_.isEqual(draft, state))
  })
}
