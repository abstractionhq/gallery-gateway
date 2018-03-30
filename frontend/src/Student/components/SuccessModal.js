import React from 'react'
import { Modal, ModalBody } from 'reactstrap'
import FaCheckCircle from 'react-icons/lib/fa/check-circle'

const SuccessModal = props => (
  <Modal
    isOpen={props.isOpen}
    style={{
      height: '400px',
      textAlign: 'center',
      top: '25%'
    }}
  >
    <div
      className='modal-header'
      style={{
        backgroundColor: '#3CB778',
        color: 'white',
        height: '100px'
      }}
    >
      <h4 className='modal-title' style={{ width: '100%' }}>
        <FaCheckCircle size='3em' style={{ margin: '0 auto' }} />
      </h4>
    </div>
    <ModalBody style={{ padding: '40px 0' }}>
      <h2 style={{ color: '#3CB778' }}>Great!</h2>
      <p>
        Your submission was successfully submitted. Check back soon to see if
        your work is invited to this show.
      </p>
    </ModalBody>
  </Modal>
)

export default SuccessModal
