<template>
  <b-container>
    <b-row>
      <b-col cols='8'>
        <ul>
          <li v-for='show in shows' :key='show.id'>
            <h4><router-link :to="`${show.id}`" append>{{ show.name }}</router-link></h4>
            <p>{{ show.description }}</p>
          </li>
        </ul>
      </b-col>
      <b-col>
        <b-button to='shows/create' variant='primary'>Create Show</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'manage-shows',
  beforeRouteEnter(to, from, next) {
    axios
      .get(`/admin/show`)
      .then((data) => {
        next(d => d.setData(data.data))
      })
  },
  beforeRouteUpdate(to, from, next) {
    this.shows = null
    axios
      .get(`/admin/show`)
      .then((data) => {
        this.setData(data.data)
        next()
      })
  },
  methods: {
    setData(data) {
      this.shows = data
    }
  },
  data () { // TODO: State Management
    return {
      shows: []
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
</style>
