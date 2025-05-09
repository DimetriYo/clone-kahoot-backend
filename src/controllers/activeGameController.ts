import { IncomingMessage } from 'http'
import ws, { WebSocket } from 'ws'
import { getRandomColor, isCorrectAnswer } from '../utils'
import { QuestionAnswer } from '../types'
import { prisma } from '../prisma'
import { Question } from '@prisma/client'
import { Request, Response } from 'express'

let gameInstance: AcitveGame | null = null

type AcitveGame = {
  id: string
  players: {
    id: string
    name: string
    bgColor: string
    answers: { questionId: string; text: string; isCorrect: boolean }[]
    clientId: string
  }[]
  allQuestions: Question[]
  activeQuestionId: string | null
}

export const isActiveGameExist = (req: Request, res: Response) => {
  if (!Boolean(gameInstance)) {
    res.status(404).send('There is no active game at the moment')
    return
  }

  if (gameInstance?.id !== req.params.id) {
    res
      .status(403)
      .send(`No game with id ${req.params.id} is currently running`)

    return
  }

  res.send('Game exists')
}

const getActiveGame = async (activeGameId: string): Promise<AcitveGame> => {
  const game = await prisma.game.findFirst({ where: { id: activeGameId } })

  if (!game) {
    throw new Error(`Game with id ${activeGameId} was not found`)
  }

  const gameQuestions = await prisma.question.findMany({
    where: { gameId: activeGameId },
  })

  const activeQuestionId = gameQuestions.length ? gameQuestions[0].id : null

  return {
    id: game.id,
    players: [],
    allQuestions: gameQuestions,
    activeQuestionId,
  }
}

const broadcastMessage = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  message: { type: string; payload: any },
) => {
  wss.clients.forEach((client) => client.send(JSON.stringify(message)))
}

const handleAnswerQuestion = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  payload: QuestionAnswer,
) => {
  const player = gameInstance?.players.find(({ id }) => payload.playerId === id)

  if (!gameInstance || !player) {
    return
  }

  player.answers.push({
    questionId: payload.questionId,
    text: payload.answer,
    isCorrect: isCorrectAnswer(payload),
  })

  broadcastMessage(wss, { type: 'GAME_DATA', payload: gameInstance })
}

const handleNewPlayerConnected = async (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  payload: { userId: string },
  clientId: string,
) => {
  if (!gameInstance) {
    return
  }

  const playerData = await prisma.user.findFirst({
    where: { id: payload.userId },
  })

  if (!playerData) {
    throw new Error(`User with id ${payload.userId} has not been found`)
  }

  const player: (typeof gameInstance.players)[number] = {
    id: playerData.id,
    name: playerData.name,
    bgColor: getRandomColor(),
    answers: [],
    clientId,
  }

  if (!gameInstance.players.some(({ id }) => id === payload.userId)) {
    gameInstance.players.push(player)
  }

  broadcastMessage(wss, { type: 'GAME_DATA', payload: gameInstance })
}

const handleChangeQuestion = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  payload: { qusetionId: string },
) => {
  if (gameInstance) {
    gameInstance.activeQuestionId = payload.qusetionId

    broadcastMessage(wss, { type: 'GAME_DATA', payload: gameInstance })
  }
}

const handleShowAnswers = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  message: { type: string; payload: { questionId: string } },
) => {
  broadcastMessage(wss, {
    type: message.type,
    payload: gameInstance!.players.map(({ answers, id }) => {
      const playerAnswer =
        answers.find(
          ({ questionId }) => questionId === message.payload.questionId,
        )?.text || null

      return { playerId: id, playerAnswer }
    }),
  })
}

const handleShowWinners = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  message: { type: string; payload: null },
) => {
  broadcastMessage(wss, message)
}

export const activeGameController = (
  ws: ws,
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  clientId: string,
) => {
  ws.on('message', async (message: string) => {
    const parsedMeesage: { type: string; payload: any } = JSON.parse(message)

    switch (parsedMeesage.type) {
      case 'START_GAME':
        const { gameId } = parsedMeesage.payload

        gameInstance = await getActiveGame(gameId)

        ws.send(JSON.stringify({ type: 'GAME_DATA', payload: gameInstance }))

        break

      case 'PLAYER_CONNECTED':
        if (!gameInstance) {
          ws.send(
            JSON.stringify({
              type: 'FAULT',
              payload: 'No game is running yet',
            }),
          )

          break
        }

        await handleNewPlayerConnected(wss, parsedMeesage.payload, clientId)

        break

      case 'CHANGE_QUESTION':
        if (gameInstance) {
          handleChangeQuestion(wss, parsedMeesage.payload)
        }

        break

      case 'ANSWER_QUESTION':
        if (gameInstance) {
          handleAnswerQuestion(wss, parsedMeesage.payload)
        }

        break

      case 'SHOW_ANSWERS':
        if (gameInstance) {
          handleShowAnswers(wss, parsedMeesage)
        }

        break

      case 'SHOW_WINNERS':
        if (gameInstance) {
          handleShowWinners(wss, parsedMeesage)
        }

        break

      case 'END_GAME':
        if (gameInstance) {
          gameInstance = null
        }

        break
    }
  })

  ws.on('close', (e) => {
    console.log('Клиент отключился')

    if (!gameInstance) {
      return
    }

    gameInstance.players = gameInstance?.players.filter(
      ({ clientId: disconnectedClient }) => disconnectedClient !== clientId,
    )

    broadcastMessage(wss, { type: 'GAME_DATA', payload: gameInstance })
  })
}
