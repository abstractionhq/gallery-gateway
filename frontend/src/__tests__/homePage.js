import React from 'react'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, render } from 'enzyme'
import Home from '../Home/Page'

Enzyme.configure({ adapter: new Adapter() });



describe('A suite', () => {
  let homeComponent
  beforeEach(() => {
    homeComponent = shallow(<Home />)
  })
  it('should render without throwing an error', () => {
    expect(homeComponent.contains(<h1>Home</h1>)).toBe(true)
  })
})
