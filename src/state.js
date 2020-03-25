import _ from 'lodash'
import { uuid } from 'uuidv4'
import { assetsTree } from './mocks/MOCK_DATA'

let _columnId = 0
let _cardId = 0

const CARD = 'card'
const COLUMN = 'column'

const columnsData = [
  { title: 'TODO', emoji: '🔥' },
  { title: 'Doing', emoji: '🥕' }
  // { title: 'Done', emoji: '🍄' }
]
export const initialState = {
  columns: columnsData.map(({ title, emoji }, i) => ({
    id: uuid(COLUMN),
    title,
    removeFromOriginal: true, //title !== 'TODO',
    cards:
      // i === 0
      //   ? assetsTree
      //   :
      Array.from({ length: 300 }).map(() => ({
        id: uuid(CARD),
        displayName: `${emoji} Card ${++_cardId}`
      }))
  }))
}

const generateCard = name => ({ id: uuid(CARD), displayName: `Card ${name}` })

const updateColumnCards = (columnIndex, updateCards) => ({ columns }) => ({
  columns: Object.assign([...columns], {
    [columnIndex]: {
      ...columns[columnIndex],
      cards: updateCards(columns[columnIndex].cards)
    }
  })
})

export const moveCard = ([curX, curY], [destX, destY]) => state => {
  // 1) Stash card so we can insert at destination
  console.log('curX, curY, destX, destY', curX, curY, destX, destY)
  const card = state.columns[curX].cards[curY]
  const { removeFromOriginal } = state.columns[curX]
  const insertAtDestination = updateColumnCards(destX, cards => [
    ...cards.slice(0, destY),
    card,
    ...cards.slice(destY)
  ])

  const removeFromSource = updateColumnCards(curX, cards => [
    ...cards.slice(0, curY),
    ...cards.slice(curY + 1)
  ])

  const flow = [insertAtDestination]
  if (removeFromOriginal || curX === destX) {
    flow.push(removeFromSource)
  }

  return _.flowRight(flow)(state)
}

export const addColumn = title => ({ columns }) => {
  const newColumn = { id: uuid(COLUMN), title, cards: [] }
  return { columns: [...columns, newColumn] }
}

export const addCard = (columnId, displayName) => state => {
  const newCard = { id: uuid(CARD), displayName }
  return updateColumnCards(
    state.columns.findIndex(column => column.id === columnId),
    cards => [...cards, newCard]
  )(state)
}
