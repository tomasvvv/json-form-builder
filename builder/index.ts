import * as Yup from "yup";

import { buildDropdownValidations } from "./dropdown";
import { buildIntegerValidations } from "./integer";
import { buildTextValidations } from "./text";
import { BackendFormSchema, ReturnedFieldValidation } from "../types";

/** build field validation by it's type */
export const buildFieldValidationsFromSchemaObject = (
    field: BackendFormSchema.SchemaField
): ReturnedFieldValidation | undefined => {
    switch (field.type) {
        case "integer":
            return buildIntegerValidations(field);

        case "dropdown":
            return buildDropdownValidations(field);

        case "text":
        case "textarea":
            return buildTextValidations(field);
    }
};

/** loop and build validation for each field */
export const buildFieldsFromArray = (schema: BackendFormSchema.Schema) => {
    return Object.fromEntries(
        schema
            .map(field => {
                const fieldSchema = extendSchemaWithDefaults(
                    buildFieldValidationsFromSchemaObject(field),
                    field
                );

                return [field.slug, fieldSchema];
            })
            .filter(Boolean)
    );
};

/** build a complete Yup schema */
export const buildYupSchemaFromJson = (schema: BackendFormSchema.Schema) =>
    Yup.object().shape(buildFieldsFromArray(schema));

/** adds default properties based on conditions and skips if there are none */
export const extendSchemaWithDefaults = <C extends Yup.BaseSchema>(
    base: C | undefined,
    field: BackendFormSchema.SchemaField
): C | undefined => {
    if (!base) return undefined;

    if (field.required) return base.required();

    const requiredCondition = field.conditions?.find(
        con => con.type === "required"
    );

    if (!requiredCondition) return base;

    const requiredFields = requiredCondition.rules
        .filter(r => !!r.field)
        .map(r => String(r.field));

    const requiredValues = requiredCondition.rules.map(r => r.value);

    if (!requiredFields?.length || !requiredValues?.length) return base;

    return base.when(requiredFields, {
        is: (...values: string[]) => {
            return values.every((value, i) => requiredValues[i] === value);
        },
        then: schema => schema.required(),
        otherwise: schema => schema.optional(),
    });
};
