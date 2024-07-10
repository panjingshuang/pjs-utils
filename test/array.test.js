import { forEachCanReturn } from '../bin/index.js'

test('forEachCanReturn function',()=>{
  expect(forEachCanReturn([{
    id: 2
  }, {
    id: 4
  }, {
    id: 5
  }],(item) => {
    if (item.id > 3) return item
  }))
})


