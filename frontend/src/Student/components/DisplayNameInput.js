import React from "react";
import { Label, FormGroup, UncontrolledTooltip } from "reactstrap";
import { Field } from "formik";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import FaQuestionCircle from "@fortawesome/fontawesome-free-solid/faQuestionCircle";

export default function DisplayNameInput({
  values,
  touched,
  errors,
  displayNameNeeded,
  renderErrors
}) {
  return (
    <FormGroup>
      <Label>Display Name</Label>
      <Field
        type="text"
        id="displayName"
        name="displayName"
        className="form-control"
        disabled = {!displayNameNeeded}
        required
      />
      {renderErrors(touched, errors, "displayName")}
    </FormGroup>
  );
}