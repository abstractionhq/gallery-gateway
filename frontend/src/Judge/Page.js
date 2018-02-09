import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Judge = () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Judge
