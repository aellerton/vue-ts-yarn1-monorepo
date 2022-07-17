<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"/>
    <HelloWorld :msg="initial"/>
    <div class="flex-grid-thirds">
      <div class="bordered col">
        <h3>Demo GET</h3>
        <span v-if="latest">{{ latest }}</span>
        <span v-else>Click to use GET API&rarr;</span>
        &nbsp;<button @click="getLatest">Update</button>
      </div>
      <div class="bordered col">
        <h3>Demo POST</h3>
        <input v-model="name" type="text" placeholder="Name here" @keyup.enter="callApi"/>
        <button @click="callApi">Post</button>
        <pre v-if="response" style="text-align: left; overflow: scroll; font-size: 0.9em">{{ response }} </pre>
      </div>
      <div class="bordered col">
        <h3>Demo Websocket</h3>
        <input v-model="wsCmd" type="text" placeholder="e.g. 'now' or 'hello'" @keyup.enter="sendWebSocket"/>
        <button v-if="ws" @click="sendWebSocket">Send</button>
        <button v-else @click="openWebSocket">Open</button>
        <div v-for="(item, i) in wsLog" :key="i" class="ws-log">
          <p><span class="ts">{{ item.ts.toLocaleTimeString() }}</span>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus">
.ws-log
  text-align: left
  border-top: 1px solid #dddddd
  margin-top: 1em
  font-size: 0.9em

  .ts
    font-size: 0.9em
    font-weight: bold
</style>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import {timestamp} from 'foolib'

function makeUrl(uri: string, protocol?: string) {
  protocol = protocol || location.protocol
  uri = uri || '/'
  let baseUrl = ''
  baseUrl = `${protocol}//${location.hostname}:3001` // comment this out if put nginx or similar in front of API daemon
  return baseUrl + uri
}

interface WsLogItem {
  ts: Date
  text: string
}

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  initial = `Library function result: ${timestamp()}` // prove calling the library function in the web app
  latest = ''
  name = ''
  response: Record<string, unknown> | null = null
  ws: WebSocket | null = null // private because don't want that to be change-monitored by Vue
  wsCmd = ''
  wsLog: WsLogItem[] = []

  callApi(): void {
    let data = {name: this.name || 'Unnamed'}
    fetch(makeUrl('/api/hello'), {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(r => {
      return r.json()
    })
      .then(data => {
        this.response = data
      })
      .catch(err => {
        this.response = {
          err
        }
      })
  }

  created(): void {
    this.openWebSocket()
  }

  getLatest(): void {
    fetch(makeUrl('/'), {
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-type': 'application/json'
      }
      // }).then(r => {
      //   return r.json()
    })
      .then(response => {
        return response.text()
      })
      .then((text) => {
        this.latest = text
      })
      .catch((err) => {
        this.latest = `Failed: ${err}`
      })
  }

  addLog(text: string): void {
    this.wsLog.unshift({ts: new Date(), text})
  }

  openWebSocket(): void {
    // might be better to do this at the app level and @Provide it
    if (!this.ws) {
      let url = makeUrl(
        '/chat',
        location.protocol === 'https:' ? 'wss:' : 'ws:'
      )
      this.ws = new WebSocket(url)
      this.addLog(`WebSocket opening ${url}`)
      this.ws.onopen = (_event) => {
        this.addLog('WebSocket opened')
      }
      this.ws.onmessage = (event) => {
        this.addLog(`WebSocket received: ${event.data}`)
      }
      this.ws.onclose = (_event) => {
        this.addLog('WebSocket closed')
        this.ws = null
      }
    }
  }

  sendWebSocket(e: KeyboardEvent & { target: HTMLInputElement }): void {
    if (this.wsCmd && this.ws) {
      this.addLog(`Websocket send: ${this.wsCmd}`)
      this.ws.send(this.wsCmd)
      // this.ws.send(JSON.stringify({text: this.wsCmd}))
      e.target?.select()
    }
  }
}
</script>
