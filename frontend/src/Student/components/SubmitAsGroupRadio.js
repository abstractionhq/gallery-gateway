import React from 'react'
import { Label, FormGroup, UncontrolledTooltip } from 'reactstrap'
import { Field } from 'formik'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'

export default function SubmitAsGroupRadio ({
  values,
  touched,
  errors,
  canSubmitAsSingle,
  renderErrors
}) {
  return (
    <FormGroup>
      <Label>Is this a group submission?</Label>
      <FormGroup check>
        <Label check>
          <Field
            type='radio'
            id='submittingAsGroup'
            name='submittingAsGroup'
            value='no'
            required
            disabled={!canSubmitAsSingle}
            checked={values.submittingAsGroup === 'no'}
          />
          {canSubmitAsSingle ? (
            <span className='ml-2'>No</span>
          ) : (
            <span className='ml-2 text-muted'>
              No&nbsp;
              <FontAwesomeIcon icon={FaQuestionCircle} className='align-middle' id='noSingleHelp' />
              <UncontrolledTooltip target='noSingleHelp'>
                <p className='text-left'>
                  You have reached your individual submission limit for this
                  show. Additional submissions must be done as a group.
                </p>
              </UncontrolledTooltip>
            </span>
          )}
        </Label>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Field
            type='radio'
            id='submittingAsGroup'
            name='submittingAsGroup'
            value='yes'
            required
            checked={values.submittingAsGroup === 'yes'}
          />
          <span className='ml-2'>Yes</span>
        </Label>
      </FormGroup>
      {renderErrors(touched, errors, 'submittingAsGroup')}
    </FormGroup>
  )
}
