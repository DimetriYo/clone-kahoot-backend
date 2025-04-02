import { Request, Response, NextFunction } from 'express'
import { type Question, questions } from '../db/questions'

// Create an item
export const createQuestion = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newQuestion: Question = { id: crypto.randomUUID(), ...req.body }
    questions.push(newQuestion)
    res.status(201).json(newQuestion)
  } catch (error) {
    next(error)
  }
}

// Read all items
export const getQuestionsByGameId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(
      questions.filter((question) => question.gameId === req.query.gameId),
    )
  } catch (error) {
    next(error)
  }
}

// Read single item
export const getSingleQuestionById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const question = questions.find((question) => question.id === req.params.id)
    if (!question) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    res.json(question)
  } catch (error) {
    next(error)
  }
}

// // Update an item
export const updateQuestion = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body
  try {
    const gameIndex = questions.findIndex(
      (question) => question.id === req.params.id,
    )
    if (gameIndex === -1) {
      res.status(404).json({ message: 'Item not found' })
      return
    }
    questions[gameIndex] = { ...req.body, id: req.params.id }
    res.json(questions[gameIndex])
  } catch (error) {
    next(error)
  }
}

// Delete an item
export const deleteQuestion = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const questionIndex = questions.findIndex((i) => i.id === req.params.id)
    if (questionIndex === -1) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    const deletedQuestion = questions.splice(questionIndex, 1)[0]
    res.json(deletedQuestion)
  } catch (error) {
    next(error)
  }
}
