import { IncomingMessage } from 'http'
import ws, { WebSocket } from 'ws'
import { games } from '../db/games'
import { questions } from '../db/questions'
import { users } from '../db/users'
import { getRandomColor } from '../utils'

let gameInstance: AcitveGame | null = null

type AcitveGame = {
  id: string
  players: {
    id: string
    name: string
    bgColor: string
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
  const allQuestions = questions.filter(({ gameId }) => gameId === activeGameId)
  const activeQuestionId = allQuestions[0].id

  return { ...game, players: [], allQuestions, activeQuestionId }
}

const broadcastGameData = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  game: AcitveGame,
) => {
  wss.clients.forEach((client) =>
    client.send(JSON.stringify({ type: 'GAME_DATA', payload: game })),
  )
}

const handleNewPlayerConnected = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  payload: { userId: string },
) => {
  if (!gameInstance) {
    return
  }

  const playerData = users.find(({ id }) => id === payload.userId)!

  const player = {
    id: playerData.id,
    name: playerData.name,
    bgColor: getRandomColor(),
  }

  if (!gameInstance.players.some(({ id }) => id === payload.userId)) {
    gameInstance.players.push(player)
  }

  broadcastGameData(wss, gameInstance)
}

const handleChangeQuestion = (
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
  payload: { qusetionId: string },
) => {
  if (gameInstance) {
    gameInstance.activeQuestionId = payload.qusetionId

    broadcastGameData(wss, gameInstance)
  }
}

export const activeGameController = (
  ws: ws,
  wss: ws.Server<typeof WebSocket, typeof IncomingMessage>,
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

        handleNewPlayerConnected(wss, parsedMeesage.payload)

        break

      case 'CHANGE_QUESTION':
        if (gameInstance) {
          handleChangeQuestion(wss, parsedMeesage.payload)
        }

        break
    }
  })

  ws.on('close', () => {
    console.log('Клиент отключился')
  })
}
