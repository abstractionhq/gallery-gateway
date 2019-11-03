import React from "react";
import { Label, FormGroup } from "reactstrap";
import { Field } from "formik";

export default function HometownInput({
  hometownNeeded,
  touched,
  errors,
  renderErrors
}) {
  return (
        <FormGroup>
          <Label>Hometown</Label>
          <Field
            type="text"
            id="hometown"
            name="hometown"
            className="form-control"
            disabled = {!hometownNeeded}
            required
          />
          {renderErrors(touched, errors, "hometown")}
        </FormGroup>
      );
}
