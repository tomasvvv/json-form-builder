import * as Yup from "yup";

import { BackendFormSchema, ReturnedFieldValidation } from "../types";

export const buildIntegerValidations = (
    field: BackendFormSchema.FieldIntegerSchema
): ReturnedFieldValidation => {
    let base = Yup.number();

    if (field.validations?.min) {
        base = base.min(field.validations.min);
    }

    if (field.validations?.max) {
        base = base.max(field.validations.max);
    }

    return base;
};
