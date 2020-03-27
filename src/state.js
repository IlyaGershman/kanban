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
        id: uuid(`${emoji}CARD`),
        displayName: `${emoji} Card ${_cardId++ % LEN}`
      }))
  }))
}

export const moveCard = (current, dest, columnOfOrigin) => state => {
  console.log(current, dest)
  const [curX, curY] = current
  const [destX, destY] = dest
  // 1) Stash card so we can insert at destination
  const card = state.columns[curX].cards[curY]

  // help functions
  const switchPlaces = draft => {
    console.log('switchPlaces')
    draft.columns[curX].cards.splice(curY, 1) // remove
    draft.columns[destX].cards.splice(destY, 0, card) // replace
  }

  const putNew = draft => {
    console.log('putNew')
    draft.columns[destX].cards.splice(destY, 0, card) // replace
  }

  // TODO: check this function something to do with the coordinates
  const remove = draft => {
    draft.columns[curX].cards.splice(curY, 1)
  }

  const switchPlacesAndRemoveDuplicates = draft => {
    console.log('switchPlacesAndRemoveDuplicates')

    // find duplicates and remove them
    let changes = Object.entries(detectDuplicates(card.id, state))
    if (changes.length > 0) {
      // console.log(changes)
      changes.forEach(([x, y]) => {
        draft.columns[x].cards.splice(y, 1)
      })
    }
    const destCol = draft.columns[destX]
    if (destCol.allowRemoveElements) destCol.cards.splice(destY, 0, card) // replace
  }

  const isOriginColumn = columnOfOrigin.id === state.columns[destX].id
  const fromOriginColumn = columnOfOrigin.id === state.columns[curX].id
  const changedColumn = curX !== destX
  const canRemoveInCurrentColumn = state.columns[curX].allowRemoveElements
  const canRemoveOrigin = columnOfOrigin.allowRemoveElements

  console.log('=======================================')
  console.log(`curX: ${curX}, curY: ${curY}, destX: ${destX}, destY: ${destY}`)
  console.log('=======================================')
  console.log(
    `
      dragging: ${card.id}
      isOriginColumn:  ${isOriginColumn}
      fromOriginColumn:  ${fromOriginColumn}
      changedColumn: ${changedColumn}
      canRemoveInCurrentColumn: ${canRemoveInCurrentColumn}
      canRemoveOrigin: ${canRemoveOrigin}
    `
  )
  console.log('=======================================')

  // the idea is to create state machine with all the cases and to analyze
  return produce(state, draft => {
    switch (true) {
      case isOriginColumn && changedColumn && canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case isOriginColumn && changedColumn && !canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case isOriginColumn && changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
      case isOriginColumn && !changedColumn && canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case isOriginColumn && !changedColumn && canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
      case isOriginColumn && !changedColumn && !canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case isOriginColumn && !changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore

      case !isOriginColumn && changedColumn && canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case !isOriginColumn && changedColumn && canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
      case !isOriginColumn && changedColumn && !canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case !isOriginColumn && !changedColumn && canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case !isOriginColumn && !changedColumn && canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
      case !isOriginColumn && !changedColumn && !canRemoveInCurrentColumn && canRemoveOrigin: // prettier-ignore
      case !isOriginColumn && !changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        switchPlaces(draft)
        break
      case !isOriginColumn && fromOriginColumn && changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        putNew(draft)
        break
      case !isOriginColumn && !fromOriginColumn && changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        switchPlaces(draft)
        break
      case isOriginColumn && changedColumn && canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        remove(draft)
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
