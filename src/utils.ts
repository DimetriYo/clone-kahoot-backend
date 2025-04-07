const COLORS = ['red', 'orange', 'blue', 'green', 'purple', 'pink']

const getRandomElement = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const getRandomColor = () => {
  return getRandomElement(COLORS)
}
