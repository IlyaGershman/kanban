import _ from 'lodash'
import { uuid } from 'uuidv4'
import { assetsTree } from './mocks/MOCK_DATA'
import produce from 'immer'

let _columnId = 0
let _cardId = 0

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
    allowRemoveElements: title !== 'TODO',
    cards:
      // i === 0
      //   ? assetsTree
      //   :
      Array.from({ length: 10 }).map(() => ({
        id: uuid(CARD),
        displayName: `${emoji} Card ${++_cardId}`
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
