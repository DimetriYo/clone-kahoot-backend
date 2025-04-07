import Server from './App'
import config from './config/config'

Server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
