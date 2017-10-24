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
  data () { // TODO: State Management
    return {
      show: {
        id: 1,
        name: 'Example Name',
        description: 'Example Description',
        entry_cap: 2,
        submission_start: '2017-11-15 12:00:00',
        submission_end: '2017-11-25 12:00:00',
        judging_start: '2017-12-15 12:00:00',
        judging_end: '2017-12-25 12:00:00',
        created_at: '2017-10-24 12:00:00',
        updated_at: '2017-10-24 12:00:00'
      }
    }
  }
}
</script>

<style scoped>

</style>
