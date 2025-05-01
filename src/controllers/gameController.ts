import { Request, Response, NextFunction } from 'express'
import { games } from '../db/games'
import { AUTHORIZATION_COOKIE_KEY } from '../constants'
import { prisma } from '../prisma'

// Create an item
export const createGame = async (req: Request, res: Response) => {
  try {
    const adminId = req.cookies[AUTHORIZATION_COOKIE_KEY]

    if (!adminId) {
      throw new Error(`There is no user with ID: ${adminId}`)
    }

    const newGame = await prisma.game.create({ data: { adminId } })

    res.status(201).json(newGame)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Read all game created by user
export const getAllUserGames = async (req: Request, res: Response) => {
  const userId = req.cookies[AUTHORIZATION_COOKIE_KEY]

  if (!userId) {
    throw new Error("Couldn't authenticate user.")
  }

  try {
    const userGames = await prisma.game.findMany({ where: { adminId: userId } })

    res.json(userGames)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Read single item
export const getSingleGameById = async (req: Request, res: Response) => {
  const gameId = req.params.id

  try {
    const game = await prisma.game.findFirst({ where: { id: gameId } })

    if (!game) {
      throw new Error(`Game with id ${gameId} was not found`)
    }

    res.json(game)
  } catch (error) {
    res.status(404).send(String(error))
  }
}

// Update an item
// export const updateGame = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { questionIds } = req.body
//     const gameIndex = games.findIndex((i) => i.id === req.params.id)
//     if (gameIndex === -1) {
//       res.status(404).json({ message: 'Item not found' })
//       return
//     }
//     games[gameIndex].questionIds = questionIds
//     res.json(games[gameIndex])
//   } catch (error) {
//     next(error)
//   }
// }

// Delete an item
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id

    const deletedGame = await prisma.game.delete({ where: { id: gameId } })

    if (!deletedGame) {
      throw new Error(`Game with id ${gameId} was not found`)
    }

    res.json(deletedGame)
  } catch (error) {
    res.status(404).send(String(error))
  }
}
