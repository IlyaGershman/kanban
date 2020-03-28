import _ from 'lodash'
import { uuid } from 'uuidv4'
import { assetsTree } from './mocks/MOCK_DATA'
import produce from 'immer'

let LEN = 10

let _cardCounter = 0
const CARD = 'card'
const COLUMN = 'column'
const columnsData = [
  { title: 'TODO', emoji: '🔥' },
  { title: 'Doing', emoji: '🥕' }
  // { title: 'Done', emoji: '🍄' } //⤵️⤴️
]

export const coordinates = {}
const columns = []

columnsData.forEach(({ title, emoji }, x) => {
  columns[x] = {
    id: uuid(COLUMN),
    title,
    emoji,
    cards: [],
    allowRemoveElements: title !== 'TODO'
  }

  Array.from({ length: LEN }).forEach((c, y) => {
    const id = `${emoji} ${CARD} ${_cardCounter++ % LEN}` //uuid(`${emoji}${CARD}`)
    const title = uuid(`${emoji}${CARD}`)

    coordinates[id] = [x, y]
    columns[x].cards.push({
      id,
      displayName: id //`${emoji} ${CARD} ${_cardCounter++ % LEN}`
    })
  })
})
export const initialState = { columns }

const setCoordinate = (id, [x, y]) => {
  coordinates[id] = [x, y]
}

export const getCoordinate = id => {
  return coordinates[id]
}

const switchCoordinates = (sourceId, targetId) => {
  const [tX, tY] = getCoordinate(targetId)
  const [sX, sY] = getCoordinate(sourceId)
  setCoordinate(sourceId, [tX, tY])
  setCoordinate(targetId, [sX, sY])
}

const removeSourceReplaceTargetCoordinate = (sourceId, targetId) => {
  const [sX, sY] = getCoordinate(sourceId)
  delete coordinates[sourceId]
  setCoordinate(targetId, [sX, sY])
}

// coordinates state

const generateCard = card => ({ ...card, id: `${card.id}_dragged` })

const detectDuplicates = (id, state) => {
  let changes = {}
  state.columns.forEach((column, x) => {
    column.cards.forEach((card, y) => {
      if (card.id == id && column.allowRemoveElements) changes[x] = y
    })
  })
  return changes
}

export const moveCard = (curId, destId, columnOfOrigin) => state => {
  console.log(curId, destId)
  const [curX, curY] = getCoordinate(curId)
  const [destX, destY] = getCoordinate(destId)
  // 1) Stash card so we can insert at destination
  const card = state.columns[curX].cards[curY]

  // help functions
  const removeCurrentInsertBeforeTarget = draft => {
    console.log('switchPlaces')
    draft.columns[curX].cards.splice(curY, 1) // remove
    draft.columns[destX].cards.splice(destY, 0, card) // replace
    switchCoordinates(
      draft.columns[destX].cards[destY].id,
      draft.columns[curX].cards[curY].id
    )
    console.log(_.cloneDeep(coordinates))
  }

  const addTargetWithPrefix = draft => {
    console.log('putNew')
    draft.columns[destX].cards.splice(destY, 0, generateCard(card)) // replace
    console.log(_.cloneDeep(coordinates))
  }

  // TODO: check this function something to do with the coordinates
  const remove = draft => {
    draft.columns[curX].cards.splice(curY, 1)
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
        removeCurrentInsertBeforeTarget(draft)
        break
      case !isOriginColumn && fromOriginColumn && changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        addTargetWithPrefix(draft)
        break
      case !isOriginColumn && !fromOriginColumn && changedColumn && !canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        removeCurrentInsertBeforeTarget(draft)
        break
      case isOriginColumn && changedColumn && canRemoveInCurrentColumn && !canRemoveOrigin: // prettier-ignore
        remove(draft)
        break
      default:
        break
    }
  })
}

export const addCard = (x, displayName = 'Card?') => state => {
  console.log('addCard')
  return produce(state, draft => {
    const card = generateCard({ displayName })
    draft.columns[x].cards.push(card)
    const y = draft.columns[x].length
    setCoordinate(card.id, [x, y])
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

// const switchPlacesAndRemoveDuplicates = draft => {
//   console.log('switchPlacesAndRemoveDuplicates')

//   // find duplicates and remove them
//   let changes = Object.entries(detectDuplicates(card.id, state))
//   if (changes.length > 0) {
//     // console.log(changes)
//     changes.forEach(([x, y]) => {
//       draft.columns[x].cards.splice(y, 1)
//     })
//   }
//   const destCol = draft.columns[destX]
//   if (destCol.allowRemoveElements) destCol.cards.splice(destY, 0, card) // replace
// }
