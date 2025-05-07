import { Request, Response } from 'express'
import { prisma, RawQuestion } from '../prisma'

const isRawQuestion = (
  rawQuestion: RawQuestion | any,
): rawQuestion is RawQuestion =>
  'gameId' in rawQuestion && 'text' in rawQuestion

const isGameExist = async (gameId: string) =>
  Boolean(await prisma.game.findFirst({ where: { id: gameId } }))

const isQuestionExist = async (questionId: string) =>
  Boolean(await prisma.question.findFirst({ where: { id: questionId } }))

// Create an item
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const rawQuestion = req.body

    if (!isRawQuestion(rawQuestion)) {
      throw new Error('Inappropriate format of question provided')
    }

    if (!(await isGameExist(rawQuestion.gameId))) {
      throw new Error(`Game with id ${rawQuestion.gameId} was not found`)
    }
    console.log(rawQuestion)

    const newQuestion = await prisma.question.create({ data: rawQuestion })

    res.status(201).json(newQuestion)
  } catch (error) {
    res.status(401).send(String(error))
  }
}

// Read all items
export const getQuestionsByGameId = async (req: Request, res: Response) => {
  const gameId = req.query.gameId as string

  try {
    const questions = await prisma.question.findMany({ where: { gameId } })

    res.json(questions)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Read single item
export const getSingleQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id
    const question = await prisma.question.findFirst({
      where: { id: questionId },
    })

    if (!question) {
      throw new Error(`Question with id ${questionId} was not found`)
    }

    res.json(question)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// // Update an item
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const newContent: RawQuestion = req.body
    const questionId = req.params.id

    if (!isRawQuestion(newContent)) {
      throw new Error(`Bad content of updated question (id: ${questionId})`)
    }

    if (!(await isQuestionExist(questionId))) {
      throw new Error(`Question with id ${questionId} was not found`)
    }

    const updatedQuestion = await prisma.question.update({
      data: newContent,
      where: { id: questionId },
    })

    res.json(updatedQuestion)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Delete an item
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.id

    const deletedQuestion = await prisma.question.delete({
      where: { id: questionId },
    })

    res.json(deletedQuestion)
  } catch (error) {
    res.status(404).send(String(error))
  }
}
