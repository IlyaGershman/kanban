import uuid from 'uuidv4'
let columns, items

export const addColumn = (index = 0, name = 'new column') => {
  const id = uuid('column')
  columns.splice()
  return columns
}

export const removeColumn = id => {
  if (id !== 0 && !id) return
  delete columns[id]
}
