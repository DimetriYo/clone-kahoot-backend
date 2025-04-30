import { randomUUID } from 'crypto'
import { Request, Response, NextFunction } from 'express'
import { type User, users } from '../db/users'
import { AUTHORIZATION_COOKIE_KEY } from '../constants'
import { prisma } from '../prisma'

type RawUser = { name: string; password: string }

const isRawUser = (rawUser: RawUser | any): rawUser is RawUser =>
  'name' in rawUser && 'password' in rawUser

// Create an item
export const createUser = async (req: Request, res: Response) => {
  try {
    const rawUser = req.body

    if (!isRawUser(rawUser)) {
      throw Error('User name or user password has not been set')
    }

    const user = await prisma.user.findFirst({ where: { name: rawUser.name } })

    if (Boolean(user)) {
      throw new Error(
        'There is a user with such a name. Please make a unique name',
      )
    }

    const { id, name } = await prisma.user.create({ data: rawUser })

    res
      .cookie(
        encodeURIComponent(AUTHORIZATION_COOKIE_KEY),
        encodeURIComponent(id),
      )
      .status(201)
      .json({ id, name })
  } catch (error) {
    res.send(String(error))
  }
}

// Read all items
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany()

    res.json(users)
  } catch (error) {
    next(error)
  }
}

// Read single item
export const getSingleUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = users.find((user) => user.id === req.params.id)

    if (!user) {
      res.status(404).json({ message: 'Question not found' })
      return
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const isAdminUser = (
  // TODO: check if is used and delete if not
  req: Request,
  res: Response,
) => {
  try {
    const isAdminUser = req.params.id === process.env.ADMIN_ID
    res.json({ isAdminUser })
  } catch (e) {
    res.status(404).json({ isAdminUser: false })
  }
}

export const authenticateUser = async (req: Request, res: Response) => {
  const { name, password } = req.body

  try {
    const { id, name: foundName } = await prisma.user.findFirstOrThrow({
      where: { name, password },
    })

    res
      .cookie(
        encodeURIComponent(AUTHORIZATION_COOKIE_KEY),
        encodeURIComponent(id),
      )
      .json({ id, name: foundName })
  } catch (error) {
    res.status(404).send('User not found')
  }
}

// Update an item
export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  req.body
  try {
    const userIndex = users.findIndex(
      (question) => question.id === req.params.id,
    )
    if (userIndex === -1) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    users[userIndex] = { ...req.body, id: req.params.id }
    res.json(users[userIndex])
  } catch (error) {
    next(error)
  }
}

// Delete an item
export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIndex = users.findIndex((i) => i.id === req.params.id)
    if (userIndex === -1) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    const deletedQuestion = users.splice(userIndex, 1)[0]
    res.json(deletedQuestion)
  } catch (error) {
    next(error)
  }
}
