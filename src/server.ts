import Server from './App'

Server.listen(process.env.PORT, parseInt(process.env.HOST as string), () => {
  console.log(
    `Server running on port ${process.env.PORT}, and host ${process.env.HOST}`,
  )
})
