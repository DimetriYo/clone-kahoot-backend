import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const games = [
  {
    id: '2c7a4cef-eae7-4812-8c66-d06213814a95',
    adminId: '24240821-bf41-4d77-8abe-efad67c011b0',
  },
  {
    id: 'ff6412e0-b940-4f45-a244-f67c7057f0cc',
    adminId: '24240821-bf41-4d77-8abe-efad67c011b0',
  },
]

const questions = [
  {
    gameId: '2c7a4cef-eae7-4812-8c66-d06213814a95',
    id: '533ec699-b529-4514-81f5-66d93bebcc8f',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4l3_LB4YHI0h4B8Ji5ZQEY_LX81bCiZUtw&s',
    text: 'First question text 1',
  },
  {
    gameId: '2c7a4cef-eae7-4812-8c66-d06213814a95',
    id: '25899b97-93be-4062-922b-55386fdc318b',
    img: 'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
    text: 'Second question text 2',
  },
  {
    gameId: 'ff6412e0-b940-4f45-a244-f67c7057f0cc',
    id: '7ff75f52-3b77-4bf1-8600-25d435b518d5',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOXBtaSz0tRbAwZnjTqXtnAHhoM6nGWAxHA&s',
    text: 'First question text 1',
  },
  {
    gameId: 'ff6412e0-b940-4f45-a244-f67c7057f0cc',
    id: 'ddb7a364-96c7-4aee-a093-af2d01363b4b',
    img: 'https://image.geo.de/35497006/t/zr/v8/w2048/r0/-/014-wnpa-world-nature-photography-awards-behaviour-mammalsbronze-donna-feledichuk-might-as-well-jump.jpg',
    text: 'Second question text 2',
  },
]

const acceptedAnswers = [
  {
    questionId: '533ec699-b529-4514-81f5-66d93bebcc8f',
    text: 'correct answer game 1, question 2',
  },
  {
    questionId: '533ec699-b529-4514-81f5-66d93bebcc8f',
    text: 'another correct answer game 1, question 2',
  },
  { questionId: '533ec699-b529-4514-81f5-66d93bebcc8f', text: 'yes' },
  {
    questionId: '25899b97-93be-4062-922b-55386fdc318b',
    text: 'correct answer game 1, question 2',
  },
  {
    questionId: '25899b97-93be-4062-922b-55386fdc318b',
    text: 'another correct answer game 1, question 2',
  },
  { questionId: '25899b97-93be-4062-922b-55386fdc318b', text: 'no' },
  {
    questionId: '7ff75f52-3b77-4bf1-8600-25d435b518d5',
    text: 'correct answer game 2, question 1',
  },
  {
    questionId: '7ff75f52-3b77-4bf1-8600-25d435b518d5',
    text: 'another correct answer game 2, question 1',
  },
  { questionId: '7ff75f52-3b77-4bf1-8600-25d435b518d5', text: 'true' },
  {
    questionId: 'ddb7a364-96c7-4aee-a093-af2d01363b4b',
    text: 'correct answer game 2, question 2',
  },
  {
    questionId: 'ddb7a364-96c7-4aee-a093-af2d01363b4b',
    text: 'another correct answer game 2, question 2',
  },
  { questionId: 'ddb7a364-96c7-4aee-a093-af2d01363b4b', text: 'false' },
]

const users = [
  { id: '24240821-bf41-4d77-8abe-efad67c011b0', name: 'Elly', password: 'sky' },
  {
    id: 'e3504d81-959d-471d-a10b-3287f7330e8c',
    name: 'Vasya',
    password: '123',
  },
]

const seedGames = async (data: any[]) => {
  await prisma.game.deleteMany()
  await prisma.game.createMany({ data })
}

const seedQuestions = async (data: any[]) => {
  await prisma.question.deleteMany()

  await prisma.question.createMany({ data })
}

const seedUsers = async (data: any[]) => {
  await prisma.user.deleteMany()

  await prisma.user.createMany({ data })
}

const seedAcceptedAnswers = async (data: any[]) => {
  await prisma.acceptedAnswer.deleteMany()

  await prisma.acceptedAnswer.createMany({ data })
}

seedGames(games)
seedQuestions(questions)
seedUsers(users)
seedAcceptedAnswers(acceptedAnswers)
