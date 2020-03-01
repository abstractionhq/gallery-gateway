import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import PortfolioDashboard from './pages/PortfolioDashboard'
import ViewShow from './pages/ViewShow'
import PrintableReport from './pages/PrintableReport'
import CreateShow from './pages/CreateShow'
import EditShow from './pages/EditShow'
import AssignJudges from './pages/AssignJudges'
import AssignPortfolioJudges from './pages/AssignPortfolioJudges'
import ManageUsers from './pages/ManageUsers'
import CreatePortfolioPeriod from './pages/CreatePortfolioPeriod'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Admin = () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/portfolio' component={PortfolioDashboard}/>
      <Route exact path='/show/new' component={CreateShow} />
      <Route exact path='/portfolio/new' component={CreatePortfolioPeriod} />
      <Route exact path='/show/:id/judges/assign' component={AssignJudges} />
      <Route exact path='/portfolio/:id/judges/assign' component={AssignPortfolioJudges} />
      <Route exact path='/show/:id/edit' component={EditShow} />
      <Route path='/show/:id/print' component={PrintableReport} />
      <Route path='/show/:id' component={ViewShow} />
      <Route path='/users' component={ManageUsers} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Admin
