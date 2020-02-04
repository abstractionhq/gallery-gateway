import React from "react";
import { Label, FormGroup, UncontrolledTooltip } from "reactstrap";
import { Field } from "formik";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import FaQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";

export default function DisplayNameInput({
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
              id="useDisplayName"
              name="useDisplayName"
              value="no"
              required
              checked={values.useDisplayName === "no"}
            />
            <span className="ml-2">No</span>
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Field
              type="radio"
              id="useDisplayName"
              name="useDisplayName"
              value="yes"
              required
              checked={values.useDisplayName === "yes"}
            />
            <span className="ml-2">Yes</span>
          </Label>
        </FormGroup>
        {renderErrors(touched, errors, "useDisplayName")}
      </FormGroup>
      {values.useDisplayName === "yes" && (
        <FormGroup>
          <Label>Pseudonym</Label>
          <Field
            type="text"
            id="displayName"
            name="displayName"
            className="form-control"
            required
          />
          {renderErrors(touched, errors, "displayName")}
        </FormGroup>
      )}
    </React.Fragment>
  );
}
