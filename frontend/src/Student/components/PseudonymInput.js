import React from "react";
import { Label, FormGroup, UncontrolledTooltip } from "reactstrap";
import { Field } from "formik";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import FaQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";

export default function PseudonymInput({
  values,
  touched,
  errors,
  renderErrors
}) {
  return (
    <React.Fragment>
      <FormGroup>
        <Label>Would you prefer to use your pseudonym?</Label>
        <FormGroup check>
          <Label check>
            <Field
              type="radio"
              id="usePseudonym"
              name="usePseudonym"
              value="no"
              required
              checked={values.usePseudonym === "no"}
            />
            <span className="ml-2">No</span>
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Field
              type="radio"
              id="usePseudonym"
              name="usePseudonym"
              value="yes"
              required
              checked={values.usePseudonym === "yes"}
            />
            <span className="ml-2">Yes</span>
          </Label>
        </FormGroup>
        {renderErrors(touched, errors, "usePseudonym")}
      </FormGroup>
      {values.usePseudonym === "yes" && (
        <FormGroup>
          <Label>Pseudonym</Label>
          <Field
            type="text"
            id="pseudonym"
            name="pseudonym"
            className="form-control"
            required
          />
          {renderErrors(touched, errors, "pseudonym")}
        </FormGroup>
      )}
    </React.Fragment>
  );
}