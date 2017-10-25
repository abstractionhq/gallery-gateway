import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import ManageShows from '../components/shows/ManageShows.vue'
import CreateShow from '../components/shows/CreateShow.vue'
import ViewShow from '../components/shows/ViewShow.vue'

Vue.use(Router)

export default new Router({
  // TODO: When Apache2 rewrites is fixed, uncomment this
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/shows',
      component: ManageShows
    },
    {
      path: '/shows/create',
      component: CreateShow
    },
    {
      path: '/shows/:id',
      component: ViewShow,
      props: true
    }
    // TODO: Catch all component for NotFound
    // TODO: Apache Rewrite for non-existant URLs
    // See: https://router.vuejs.org/en/essentials/history-mode.html
  ]
})
