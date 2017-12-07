import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import SubmissionForm from './pages/SubmissionForm'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Admin = () => (
  <Layout>
    <Switch>
      <Route exact path='/student' component={Dashboard} />
      <Route exact path='/student/submit' component={SubmissionForm} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Admin
