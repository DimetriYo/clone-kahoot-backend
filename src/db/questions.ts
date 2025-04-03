export type RawQuestion = {
  gameId: string
  img?: string
  text: string
  acceptedAnswers: string[]
}

export type Question = RawQuestion & { id: string }

export const questions: Question[] = [
  {
    gameId: '2c7a4cef-eae7-4812-8c66-d06213814a95',
    id: '533ec699-b529-4514-81f5-66d93bebcc8f',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp4l3_LB4YHI0h4B8Ji5ZQEY_LX81bCiZUtw&s',
    text: 'First question text 1',
    acceptedAnswers: [
      'correct answer game 1, question 1',
      'another correct answer game 1, question 1',
    ],
  },
  {
    gameId: '2c7a4cef-eae7-4812-8c66-d06213814a95',
    id: '25899b97-93be-4062-922b-55386fdc318b',
    img: 'https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=612x612&w=0&k=20&c=N-pGA8OClRVDzRfj_9AqANnOaDS3devZWwrQNwZuDSk=',
    text: 'Second question text 2',
    acceptedAnswers: [
      'correct answer game 1, question 2',
      'another correct answer game 1, question 2',
    ],
  },
  {
    gameId: 'ff6412e0-b940-4f45-a244-f67c7057f0cc',
    id: '7ff75f52-3b77-4bf1-8600-25d435b518d5',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnOXBtaSz0tRbAwZnjTqXtnAHhoM6nGWAxHA&s',
    text: 'First question text 1',
    acceptedAnswers: [
      'correct answer game 2, question 1',
      'another correct answer game 2, question 1',
    ],
  },
  {
    gameId: 'ff6412e0-b940-4f45-a244-f67c7057f0cc',
    id: 'ddb7a364-96c7-4aee-a093-af2d01363b4b',
    img: 'https://image.geo.de/35497006/t/zr/v8/w2048/r0/-/014-wnpa-world-nature-photography-awards-behaviour-mammalsbronze-donna-feledichuk-might-as-well-jump.jpg',
    text: 'Second question text 2',
    acceptedAnswers: [
      'correct answer game 2, question 2',
      'another correct answer game 2, question 2',
    ],
  },
]
