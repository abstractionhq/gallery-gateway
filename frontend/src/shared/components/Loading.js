import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaCircleNotch from '@fortawesome/fontawesome-free-solid/faCircleNotch'

const Loading = () => (
  <div className='text-center p-2'>
    <FontAwesomeIcon icon={FaCircleNotch} spin size='4x' />
  </div>
)

export default Loading
