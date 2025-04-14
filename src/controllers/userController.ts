import { Request, Response, NextFunction } from 'express'
import { type User, users } from '../db/users'
import { AUTHORIZATION_COOKIE_KEY } from '../constants'

// Create an item
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser: User = { id: crypto.randomUUID(), ...req.body }

    users.push(newUser)

    const userData = { id: newUser.id, name: newUser.name }

    res
      .cookie(
        encodeURIComponent(AUTHORIZATION_COOKIE_KEY),
        encodeURIComponent(newUser.id),
      )
      .status(201)
      .json(userData)
  } catch (error) {
    next(error)
  }
}

// // Read all items
export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isExistUser = users.some((user) => user.id === req.params.id)

    if (!isExistUser) {
      res.status(404).json({ message: ' not found' })
      return
    }

    const isAdminUser = req.params.id === process.env.ADMIN_ID

    res.json(isAdminUser)
  } catch (error) {
    next(error)
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body

  try {
    const user = users.find(
      (user) => user.name === name && user.password === password,
    )

    if (!user) {
      res.status(404).json({ message: 'Question not found' })
      return
    }

    res
      .cookie(
        encodeURIComponent(AUTHORIZATION_COOKIE_KEY),
        encodeURIComponent(user.id),
      )
      .json(user)
  } catch (error) {
    next(error)
  }
}

// // Update an item
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
