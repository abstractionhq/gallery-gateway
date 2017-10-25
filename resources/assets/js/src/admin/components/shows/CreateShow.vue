<template>
  <b-container>
    <h1>Create Show</h1>
    <b-row>
      <b-col>
        <b-form @submit.prevent='onSubmit'>
          <b-form-group
            label='Name'
            label-for='name'>
            <b-form-input
              id='name'
              v-model='form.name'>
            </b-form-input>
          </b-form-group>
          <b-form-group
            label='Description'
            label-for='description'>
            <b-form-textarea
              id='description'
              v-model='form.description'
              :rows='3'
              :max-rows='6'>
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            label='Submission Limit'
            label-for='submission-limit'>
            <b-form-input
              type='number'
              id='submission-limit'
              v-model='form.entry_cap'>
            </b-form-input>
          </b-form-group>
          <b-form-group
            label='Submission Starts'
            label-for='submission-start'>
            <b-form-input
              type='date'
              id='submission-start'
              v-model='form.submission_start'>
            </b-form-input>
          </b-form-group>
          <b-form-group
            label='Submission Ends'
            label-for='submission-end'>
            <b-form-input
              type='date'
              id='submission-end'
              v-model='form.submission_end'>
            </b-form-input>
          </b-form-group>
          <b-form-group
            label='Judging Starts'
            label-for='judging-start'>
            <b-form-input
              type='date'
              id='judging-start'
              v-model='form.judging_start'>
            </b-form-input>
          </b-form-group>
          <b-form-group
            label='Judging Ends'
            label-for='judging-end'>
            <b-form-input
              type='date'
              id='judging-end'
              v-model='form.judging_end'>
            </b-form-input>
          </b-form-group>

          <b-button type='submit' variant='primary'>Submit</b-button>
        </b-form>
      </b-col>
    </b-row>
    <vue-toast ref='toast'></vue-toast>
  </b-container>
</template>

<script>
import VueToast from 'vue-toast'

let toast

export default {
  name: 'create-show',
  components: {
    VueToast
  },
  data() {
    return {
      form: {
        entry_cap: 2
      }
    }
  },
  mounted() {
    toast = this.$refs.toast
    toast.setOptions({position: 'bottom right'})
  },
  methods: {
    onSubmit() {
      axios
        .post('/admin/show', this.form)
        .then(() => {
          toast.showToast('Show Successfully Created', {theme: 'success'})
          const router = this.$router
          setTimeout(function() {
            router.push({path: '/shows'})
          }, 1000)
        })
        .catch(() => {
          toast.showToast('There was an error. Please try again.', {theme: 'error'})
        })


    }
  }
}
</script>

<style scoped>

</style>
