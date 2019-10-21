import React from "react";
import { Label, FormGroup, UncontrolledTooltip } from "reactstrap";
import { Field } from "formik";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import FaQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";

export default function HometownInput({
  values,
  touched,
  errors,
  renderErrors
}) {
  return (
    <React.Fragment>
      <FormGroup>
        <Label>Would you like to include your hometown?</Label>
        <FormGroup check>
          <Label check>
            <Field
              type="radio"
              id="includeHometown"
              name="includeHometown"
              value="no"
              required
              checked={values.includeHometown === "no"}
            />
            <span className="ml-2">No</span>
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Field
              type="radio"
              id="includeHometown"
              name="includeHometown"
              value="yes"
              required
              checked={values.includeHometown === "yes"}
            />
            <span className="ml-2">Yes</span>
          </Label>
        </FormGroup>
        {renderErrors(touched, errors, "includeHometown")}
      </FormGroup>
      {values.includeHometown === "yes" && (
        <FormGroup>
          <Label>Hometown</Label>
          <Field
            type="text"
            id="hometown"
            name="hometown"
            className="form-control"
            required
          />
          {renderErrors(touched, errors, "hometown")}
        </FormGroup>
      )}
    </React.Fragment>
  );
}
