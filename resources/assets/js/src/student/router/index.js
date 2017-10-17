import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'

Vue.use(Router)

export default new Router({
  // TODO: When Apache2 rewrites is fixed, uncomment this
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: HelloWorld
    }
    // TODO: Catch all component for NotFound
    // TODO: Apache Rewrite for non-existant URLs
    // See: https://router.vuejs.org/en/essentials/history-mode.html
  ]
})
