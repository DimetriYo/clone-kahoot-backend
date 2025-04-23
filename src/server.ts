import Server from './App'
import config from './config/config'

Server.listen(config.port, config.host, () => {
  console.log(`Server running on port ${config.port}, and host ${config.host}`)
})
