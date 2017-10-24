<template>
  <b-container>
    <h1>Home</h1>
    <h2>{{ msg }}</h2>
    <router-link to='shows'>Manage Shows</router-link>
  </b-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Hello, Admin'
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
