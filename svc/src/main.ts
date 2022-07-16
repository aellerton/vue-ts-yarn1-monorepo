import { makeServer } from './app'

const port = 3001
const { app, upgradeWs } = makeServer()
const httpServer = app.listen(port, () => {
  console.log(`Daemon listening on port ${port}`)
}).on('upgrade', upgradeWs)
