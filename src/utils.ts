import { questions } from './db/questions'
import { QuestionAnswer } from './types'

const COLORS = ['red', 'orange', 'blue', 'green', 'purple', 'pink']

const getRandomElement = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const getRandomColor = () => {
  return getRandomElement(COLORS)
}

export const isCorrectAnswer = ({ answer, questionId }: QuestionAnswer) => {
  const correctAnswers = questions.find(
    ({ id }) => id === questionId,
  )?.acceptedAnswers

  if (!correctAnswers) return false

  return correctAnswers.includes(answer)
}
