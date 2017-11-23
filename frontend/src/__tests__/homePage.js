import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Home from '../Home/Page'

Enzyme.configure({ adapter: new Adapter() })

describe('A Suite', function () {
  let homeComponent

  beforeEach(function () {
    homeComponent = shallow(<Home />)
  })

  it('Should render without throwing an error', function () {
    expect(homeComponent.contains('Gallery Gateway')).toBe(true)
  })
})
