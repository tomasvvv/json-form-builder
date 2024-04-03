import * as Yup from "yup";

import { BackendFormSchema, ReturnedFieldValidation } from "../types";

export const buildDropdownValidations = (
    field: BackendFormSchema.FieldDropdownSchema
): ReturnedFieldValidation => {
    let base = Yup.string();

    base = base.oneOf(field.options.map(option => option.slug));

    return base;
};
