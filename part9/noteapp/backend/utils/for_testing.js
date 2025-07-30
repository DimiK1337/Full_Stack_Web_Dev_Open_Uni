
const reverse = str => str.split('').reverse().join('')

const average = array => {
  const reducer = (accumulatedSum, num) => accumulatedSum + num
  const average = array.reduce(reducer, 0) / array.length
  return array.length === 0 ? 0 : average
}

module.exports = {
  reverse,
  average
}