import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Submit from './pages/Submit'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Student = () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/submit' component={Submit} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Student
