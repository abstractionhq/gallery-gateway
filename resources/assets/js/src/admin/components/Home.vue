<template>
  <div>
    <main class='container'>
      <h1>Home</h1>
      <h2>{{ msg }}</h2>
      <router-link to='shows'>Manage Shows</router-link>
    </main>
  </div>
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
