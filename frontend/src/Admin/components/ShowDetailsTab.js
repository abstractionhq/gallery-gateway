import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

const ShowDetailsTab = props => (
  <div>
    <p>
      <Button>Generate CSV Report</Button>
    </p>
    <p>
      <Button>Generate Gallery Guide</Button>
    </p>
    <p>
      <Button onClick={() => props.downloadZip()}>Download Zip</Button>
    </p>
  </div>
)

export default ShowDetailsTab
