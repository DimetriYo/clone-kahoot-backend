import { Request, Response, NextFunction } from 'express'
import { type Game, games } from '../db/games'

// Create an item
export const createGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionIds } = req.body
    const newGame: Game = { id: crypto.randomUUID(), questionIds }
    games.push(newGame)
    res.status(201).json(newGame)
  } catch (error) {
    next(error)
  }
}

// Read all items
export const getAllGames = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(games)
  } catch (error) {
    next(error)
  }
}

// Read single item
export const getSingleGameById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const game = games.find((game) => game.id === req.params.id)
    if (!game) {
      res.status(404).json({ message: 'Game not found' })
      return
    }
    res.json(game)
  } catch (error) {
    next(error)
  }
}

// Update an item
export const updateGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionIds } = req.body
    const gameIndex = games.findIndex((i) => i.id === req.params.id)
    if (gameIndex === -1) {
      res.status(404).json({ message: 'Item not found' })
      return
    }
    games[gameIndex].questionIds = questionIds
    res.json(games[gameIndex])
  } catch (error) {
    next(error)
  }
}

// Delete an item
export const deleteGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameIndex = games.findIndex((i) => i.id === req.params.id)
    if (gameIndex === -1) {
      res.status(404).json({ message: 'Item not found' })
      return
    }
    const deletedGame = games.splice(gameIndex, 1)[0]
    res.json(deletedGame)
  } catch (error) {
    next(error)
  }
}
