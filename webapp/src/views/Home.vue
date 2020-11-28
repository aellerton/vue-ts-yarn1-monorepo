<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld :msg="initial" />
    <div class="bordered">
      <span v-if="latest">{{ latest }}</span>
      <span v-else>Click to use GET API&rarr;</span>
      &nbsp;<button @click="getLatest">Update</button>
    </div>
    <div class="bordered">
      <input v-model="name" type=text placeholder="Name here">
      <button @click="callApi">Call POST API</button>
      <pre v-if="response" style="text-align: left">{{ response }} </pre>
    </div>
  </div>
</template>
<style scoped lang="stylus">
.bordered
  border: 1px solid #dddddd;
  padding: 6px
  margin-bottom: 1em
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import HelloWorld from "@/components/HelloWorld.vue" // @ is an alias to /src
import { timestamp } from "foolib"

function makeUrl(uri: string) {
  uri = uri || '/'
  let baseUrl = ''
  baseUrl = `${location.protocol}//${location.hostname}:3001` // comment this out if put nginx or similar in front of API daemon
  return baseUrl + uri
}

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  initial: string = `Library function result: ${timestamp()}`
  latest: string = ''
  name: string = ''
  response: object | null = null

  getLatest() {
    fetch(makeUrl(`/`), {
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-type": "application/json"
      }
    // }).then(r => {
    //   return r.json()
    }).then(response => {
      return response.text()
    }).then(text => {
      this.latest = text
    }).catch(err => {
      this.latest = `Failed: ${err}`
    })
  }
  callApi() {
    let data = { name: this.name || 'Unnamed' }
    fetch(makeUrl(`/api/hello`), {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(r => {
      return r.json()
    }).then(data => {
      this.response = data
    }).catch(err => {
      this.response = {
        err
      }
    })
  }
}
</script>
