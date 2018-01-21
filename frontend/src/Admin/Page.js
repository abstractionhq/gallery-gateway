import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import ViewShow from './pages/ViewShow'
import CreateShow from './pages/CreateShow'
import AssignJudges from './pages/AssignJudges'
import ManageJudges from './pages/ManageJudges'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Admin = () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/show/new' component={CreateShow} />
      <Route exact path='/show/:id' component={ViewShow} />
      <Route exact path='/show/:id/judges' component={AssignJudges} />
      <Route exact path='/judges' component={ManageJudges} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Admin
