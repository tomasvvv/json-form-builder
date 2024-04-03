import * as Yup from "yup";

export type ReturnedFieldValidation = Yup.BaseSchema;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BackendFormSchema {
    export type FieldType = "dropdown" | "integer" | "text" | "textarea";

    export type ConditionRuleType = "equal" | "visible" | "or" | "required";

    export type ConditionRule<C = ConditionRuleType> = {
        type: C;
        field?: string;
        value?: string;
        rules?: C extends "or" ? Array<ConditionRule> : never;
    };

    export type FieldCondition = {
        type: ConditionRuleType;
        rules: Array<ConditionRule>;
    };

    export type BaseFieldSchema<T extends FieldType> = {
        title: string;
        slug: string;
        required?: boolean;
        type: T;
        conditions?: Array<FieldCondition>;
    };

    export type DropdownOptionSchema = {
        title: string;
        slug: string;
    };

    export interface FieldDropdownSchema extends BaseFieldSchema<"dropdown"> {
        options: Array<DropdownOptionSchema>;
    }

    export type NumberValidations = {
        min?: number;
        max?: number;
    };

    export interface FieldIntegerSchema extends BaseFieldSchema<"integer"> {
        validations?: NumberValidations;
        format?: "currency" | "default";
    }

    export type FieldTextAreaSchema = BaseFieldSchema<"textarea">;
    export type FieldTextSchema = BaseFieldSchema<"text">;

    export type SchemaField =
        | FieldDropdownSchema
        | FieldIntegerSchema
        | FieldTextAreaSchema
        | FieldTextSchema;

    export type Schema = Array<SchemaField>;
}
