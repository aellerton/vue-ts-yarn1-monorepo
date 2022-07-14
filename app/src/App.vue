<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px

.bordered
  border: 1px solid #dddddd;
  padding: 6px
  margin-bottom: 1em

// see https://css-tricks.com/dont-overthink-flexbox-grids/
.flex-grid
  display: flex

.col
  flex: 1

.flex-grid-thirds
  display: flex
  justify-content: space-between

.flex-grid-thirds .col
  width: 32%

@media (max-width: 400px)
  .flex-grid
    display: block

</style>
