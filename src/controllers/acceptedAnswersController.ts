import { Request, Response } from 'express'
import { prisma, RawAcceptedAnswer } from '../prisma'
import { AcceptedAnswer } from '@prisma/client'

const isRawAcceptedAnswers = (
  rawQuestions: (RawAcceptedAnswer | AcceptedAnswer)[] | any,
): rawQuestions is (RawAcceptedAnswer | AcceptedAnswer)[] =>
  Array.isArray(rawQuestions) &&
  rawQuestions.every(
    (acceptedAnswer) =>
      'questionId' in acceptedAnswer && 'text' in acceptedAnswer,
  )

const isQuestionExist = async (questionId: string) =>
  Boolean(await prisma.question.findFirst({ where: { id: questionId } }))

// Create an item
export const createAcceptedAnswers = async (req: Request, res: Response) => {
  try {
    const rawAcceptedAnswers: any = req.body

    if (!isRawAcceptedAnswers(rawAcceptedAnswers)) {
      throw new Error('Inappropriate format of accepted answers provided')
    }

    if (
      (
        await Promise.all(
          rawAcceptedAnswers.map(({ questionId }) =>
            isQuestionExist(questionId),
          ),
        )
      ).some((value) => value === false)
    ) {
      throw new Error(
        `Question with id ${rawAcceptedAnswers[0]['questionId']} was not found`,
      )
    }

    const createdAcceptedAnswersCount = await prisma.acceptedAnswer.createMany({
      data: rawAcceptedAnswers,
    })

    res.status(201).json(createdAcceptedAnswersCount)
  } catch (error) {
    res.status(401).send(String(error))
  }
}

// Read all items
export const getAcceptedAnswersByQuestionId = async (
  req: Request,
  res: Response,
) => {
  const questionId = req.query.questionId as string

  try {
    const acceptedAnswers = await prisma.acceptedAnswer.findMany({
      where: { questionId },
    })

    res.json(acceptedAnswers)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Read single item
// export const getSingleQuestionById = async (req: Request, res: Response) => {
//   try {
//     const questionId = req.params.id
//     const question = await prisma.question.findFirst({
//       where: { id: questionId },
//     })

//     if (!question) {
//       throw new Error(`Question with id ${questionId} was not found`)
//     }

//     res.json(question)
//   } catch (error) {
//     res.status(404).send(String(error))
//   }
// }

// // Update an item
export const updateAcceptedAnswersByQuestionId = async (
  req: Request,
  res: Response,
) => {
  try {
    const questionId = req.query.questionId as string | undefined
    const newAnswers: RawAcceptedAnswer | AcceptedAnswer = req.body

    if (!isRawAcceptedAnswers(newAnswers)) {
      throw new Error(`Bad content of updated accepted answers`)
    }

    if (!questionId) {
      throw new Error('Question id has not been provided')
    }

    if (!(await isQuestionExist(questionId))) {
      throw new Error(
        `Quesition with ID ${questionId} was not found while updating accepted answers`,
      )
    }

    await prisma.acceptedAnswer.deleteMany({ where: { questionId } })

    const updatedAcceptedAnswers =
      await prisma.acceptedAnswer.createManyAndReturn({ data: newAnswers })

    res.json(updatedAcceptedAnswers)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Delete an item
export const deleteAcceptedAnswersByQuestionId = async (
  req: Request,
  res: Response,
) => {
  try {
    const questionId = req.query.questionId as string

    const deletedAnswersCount = await prisma.acceptedAnswer.deleteMany({
      where: { questionId },
    })

    res.json(deletedAnswersCount)
  } catch (error) {
    res.status(404).send(String(error))
  }
}
