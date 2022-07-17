import express, {Express} from 'express'
import {IncomingMessage, Server as HttpServer} from 'http'
import {Socket} from 'net'
import ws, {RawData, WebSocket} from 'ws'
import cors from 'cors'
import {timestamp} from 'foolib'

const WS_PATH = '/chat'

type UpgradeHandler = (request: IncomingMessage, socket: Socket, upgradeHead: Buffer, callback: (client: WebSocket, request: IncomingMessage) => void) => void

export function makeServer(port: number = 3001): Express {
  const app = express()

  app.use(express.json())

  // Use this here for CORS on all endpoints, or add it as a handler for individual
  // endpoints like "app.post('/api/hello', cors(), (req, res) => {...})".
  app.use(cors())

  app.get('/', (req: express.Request, res: express.Response) => {
    res.send(`TypeScript at ${timestamp()}`)
  })

  app.post('/api/hello', (req: express.Request, res: express.Response) => {
    let now = new Date()
    res.json({
      ts: now,
      received: req.body, // NOTE: if this is blank, ensure the send provides header 'Content-type: application/json'
      origin: {
        hostname: req.hostname,
        origin: req.headers['origin'] ?? '',
        refer: req.headers['referer'] ?? '',
        agent: req.headers['user-agent'] ?? '',
        ip: req.headers['x-forwarded-for'] ?? req.socket.remoteAddress
      }
    })
  })
  return app
}

export function processJsonInput(msg: string, ts: string): string {
  let parsed: Record<string, any>
  try {
    parsed = JSON.parse(msg)
  } catch (err) {
    return JSON.stringify({error: 'Failed to parse'})
  }

  if (typeof parsed.text === 'string') {
    return JSON.stringify({text: processTextInput(parsed.text, ts), ts})
  } else {
    return JSON.stringify({error: 'JSON message not understood'})
  }
}

export function processTextInput(msg: string, ts: string): string {
  if (msg === 'now') {
    return `The time is ${ts}`
  } else if (msg === 'hello' || msg === 'hi') {
    return 'Greetings!'
  } else if (msg === 'boo') {
    return 'yah!'
  } else if (!msg) {
    return 'Hmmm?'
  } else {
    return `Could not process "${msg}"`
  }
}

// (this: Server, socket: WebSocket, request: http.IncomingMessage) => void
export function makeSocketHandler(socket: WebSocket, request: IncomingMessage): void {
  socket.on('message', (data: RawData, isBinary: boolean) => {
    function fail(error: string) {
      socket.send(JSON.stringify({error}))
    }

    const ts = timestamp()
    if (isBinary) {
      // res.error = 'Binary data received'
      return fail('Binary data received')
    }
    if (!data) {
      return fail('Null data received')
    }
    const str: string = data.toString()
    if (!str) {
      return fail('Blank data received')
    } else if (str.startsWith('{')) {
      socket.send(processJsonInput(str, ts))
    } else {
      socket.send(processTextInput(str, ts))
    }
  })
}

export function upgradeServer(server: HttpServer): HttpServer {
  // If you need another websocket handler on a different URL, just add another
  // ws.Server object - and remember to handle the 'upgrade' below.
  const wsServer = new ws.Server({noServer: true, path: WS_PATH})

  wsServer.on('connection', makeSocketHandler)

  const upgradeWs = (request: IncomingMessage, socket: Socket, head: Buffer) => {
    if (request.url === WS_PATH) {
      wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
      })
    }
  }

  server.on('upgrade', upgradeWs)
  return server
}
