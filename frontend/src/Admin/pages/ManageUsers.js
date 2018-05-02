import React from 'react'
import { TabContent, TabPane, Container } from 'reactstrap'
import { RoutedTabs, NavTab } from 'react-router-tabs'
import { Route, Switch } from 'react-router-dom'

import ManageAdminsTab from '../containers/ManageAdminsTab'
import ManageJudgesTab from '../containers/ManageJudgesTab'
import ManageStudentsTab from '../containers/ManageStudentsTab'

const ManageUsers = () => (
  <Container>
    <RoutedTabs
      startPathWith='/users'
      className='nav nav-tabs'
      style={{ marginBottom: '1rem' }}
    >
      {/* 'replace={false} makes it so tab navigation is in the browser history */}
      <NavTab
        exact
        to='/students'
        replace={false}
        className='nav-item nav-link'
      >
        Students
      </NavTab>
      <NavTab
        exact
        to='/judges'
        replace={false}
        className='nav-item nav-link'
      >
        Judges
      </NavTab>
      <NavTab
        exact
        to='/admins'
        replace={false}
        className='nav-item nav-link'
      >
        Admins
      </NavTab>
    </RoutedTabs>
    <TabContent>
      <TabPane>
        <Switch>
          <Route
            exact
            path={`/users/students`}
            component={ManageStudentsTab}
          />
          <Route
            exact
            path={`/users/judges`}
            component={ManageJudgesTab}
          />
          <Route
            exact
            path={`/users/admins`}
            component={ManageAdminsTab}
          />
        </Switch>
      </TabPane>
    </TabContent>
  </Container>
)

export default ManageUsers
