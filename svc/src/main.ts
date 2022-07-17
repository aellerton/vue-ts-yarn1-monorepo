import {makeServer, upgradeServer} from './app'

const port = 3001
const app = makeServer()
const httpServer = upgradeServer(app.listen(port, () => {
  console.log(`Service ready on port ${port}`)
}))
