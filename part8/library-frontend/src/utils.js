
const uniqByProp = (a, propName) => {
  const seen = new Set()
  return a.filter(item => seen.has(item[propName]) ? false : seen.add(item[propName]))
}

export {
  uniqByProp
}