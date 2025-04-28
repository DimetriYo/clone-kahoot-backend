import { IncomingMessage } from 'http'
import ws, { WebSocket } from 'ws'
import { games } from '../db/games'
import { questions } from '../db/questions'
import { users } from '../db/users'
import { getRandomColor, isCorrectAnswer } from '../utils'
import { QuestionAnswer } from '../types'
import { prisma } from '../prisma'

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
  allQuestions: {
    id: string
    img?: string | undefined
    text: string
  }[]
  activeQuestionId: string
}

const getActiveGame = (activeGameId: string): AcitveGame => {
  const game = games.find(({ id }) => id === activeGameId)!
  const allQuestions = questions
    .filter(({ gameId }) => gameId === activeGameId)
    .map(({ acceptedAnswers, gameId, ...question }) => ({
      ...question,
    }))
  const activeQuestionId = allQuestions[0].id

  return { ...game, players: [], allQuestions, activeQuestionId }
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

const handleNewPlayerConnected = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  payload: { userId: string },
  clientId: string,
) => {
  if (!gameInstance) {
    return
  }

  const asdf = prisma

  const playerData = users.find(({ id }) => id === payload.userId)!

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
  broadcastMessage(wss, message)
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
  ws.on('message', (message: string) => {
    const parsedMeesage: { type: string; payload: any } = JSON.parse(message)

    switch (parsedMeesage.type) {
      case 'START_GAME':
        const { gameId } = parsedMeesage.payload
        gameInstance = getActiveGame(gameId)
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

        handleNewPlayerConnected(wss, parsedMeesage.payload, clientId)

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
