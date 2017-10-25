<template>
  <b-container>
    <h1>{{ show.name }}</h1>
    <b-row>
      <b-col>
        <dl>
          <dt>Description</dt>
          <dd>{{ show.description }}</dd>
          <dt>Submission Limit</dt>
          <dd>{{ show.entry_cap }}</dd>
          <dt>Submission Starts</dt>
          <dd>{{ show.submission_start }}</dd>
          <dt>Submission Ends</dt>
          <dd>{{ show.submission_end }}</dd>
          <dt>Judging Starts</dt>
          <dd>{{ show.judging_start }}</dd>
          <dt>Judging Ends</dt>
          <dd>{{ show.judging_end }}</dd>
        </dl>
        <router-link to='/shows'>&lt; Back</router-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'view-show',
  beforeRouteEnter(to, from, next) {
    axios
      .get(`/admin/show/${to.params.id}`)
      .then((data) => {
        next(d => d.setData(data.data))
      })
  },
  beforeRouteUpdate(to, from, next) {
    this.show = null
    axios
      .get(`/admin/show/${to.params.id}`)
      .then((data) => {
        this.setData(data.data)
        next()
      })
  },
  methods: {
    setData(data) {
      this.show = data
    }
  },
  data () { // TODO: State Management
    return {
      show: {}
    }
  }
}
</script>

<style scoped>

</style>
