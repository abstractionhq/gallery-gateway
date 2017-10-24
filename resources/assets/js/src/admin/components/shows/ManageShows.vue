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
  data () {
    return {
      shows: [
        {
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
        },
        {
          id: 2,
          name: 'Example Name 2',
          description: 'Example Description 2',
          entry_cap: 3,
          submission_start: '2017-11-15 12:00:00',
          submission_end: '2017-11-25 12:00:00',
          judging_start: '2017-12-15 12:00:00',
          judging_end: '2017-12-25 12:00:00',
          created_at: '2017-10-24 12:00:00',
          updated_at: '2017-10-24 12:00:00'
        }
      ]
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
