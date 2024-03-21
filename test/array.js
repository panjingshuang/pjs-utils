import { forEachCanReturn } from '../array.js'

function forEachCanReturnTest() {
  const array = [{
    id: 2
  }, {
    id: 4
  }, {
    id: 5
  }]
  const item = forEachCanReturn(array, (item) => {
    if (item.id > 3) return item
  })
  console.log(item)
}

forEachCanReturnTest()
