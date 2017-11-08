import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import ViewShow from './pages/ViewShow'
import CreateShow from './pages/CreateShow'
import ManageJudges from './pages/ManageJudges'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Admin = () => (
  <Layout>
    <Switch>
      <Route exact path='/admin' component={Dashboard} />
      <Route exact path='/admin/show/create' component={CreateShow} />
      <Route exact path='/admin/show/:id' component={ViewShow} />
      <Route exact path='/admin/show/:id/judges' component={ManageJudges} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Admin
