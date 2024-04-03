import * as Yup from "yup";

import { BackendFormSchema, ReturnedFieldValidation } from "../types";

export const buildTextValidations = (
    field:
        | BackendFormSchema.FieldTextAreaSchema
        | BackendFormSchema.FieldTextSchema
): ReturnedFieldValidation => {
    const base = Yup.string();

    return base;
};
