import { prisma } from './prisma'
import { QuestionAnswer } from './types'

const COLORS = ['red', 'orange', 'blue', 'green', 'purple', 'pink']

const getRandomElement = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const getRandomColor = () => {
  return getRandomElement(COLORS)
}

export const isCorrectAnswer = async ({
  answer,
  questionId,
}: QuestionAnswer) => {
  const correctAnswers = await prisma.acceptedAnswer.findMany({
    where: { questionId },
  })

  if (!correctAnswers) return false

  return correctAnswers.some(({ text }) => text === answer)
}
