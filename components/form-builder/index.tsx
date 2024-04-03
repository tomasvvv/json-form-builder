import React from "react";

import { Form, Formik, useFormikContext, getIn } from "formik";
import pick from "lodash/pick";

import { Button } from "components/Button";
import { FieldInput } from "components/FieldInput";
import { FieldNumber } from "components/FieldNumber";
import { FieldSelect } from "components/FieldSelect";
import { ISelectOption } from "components/FieldSelect";
import { FieldWrapper } from "components/FieldWrapper";

import { buildYupSchemaFromJson } from "./schema-builder";
import { exampleBackendSchema } from "./schema-example";
import { BackendFormSchema } from "./types";

const Errors = () => {
    const { errors } = useFormikContext();

    return <pre>{JSON.stringify(errors, undefined, "\t")}</pre>;
};

interface FieldCompProps {
    name: string;
    value: string;
    "data-testid": string;
    disabled: boolean;
    id: string;
    onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
    onFocus: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
    status?: "warning" | "error";
}

type ComponentProps<C> = C & Partial<FieldCompProps>;

const mapFieldToComponent = {
    dropdown: (
        props: ComponentProps<BackendFormSchema.FieldDropdownSchema>
    ) => {
        const mappedOptions: ISelectOption[] = props.options.map(option => ({
            label: option.title,
            value: option.slug,
        }));

        mappedOptions.push({
            label: "Shouldnt pass with this",
            value: "dontwork",
        });
        const filteredProps = pick(props, "placeholder");

        return (
            <FieldSelect
                {...filteredProps}
                name={props.slug}
                options={mappedOptions}
            />
        );
    },
    integer: ({
        type,
        ...props
    }: ComponentProps<BackendFormSchema.FieldIntegerSchema>) => (
        <FieldNumber {...props} name={props.slug} />
    ),
    text: (
        props: ComponentProps<BackendFormSchema.BaseFieldSchema<"text">>
    ) => <FieldInput {...props} name={props.slug} />,
    textarea: (
        props: ComponentProps<BackendFormSchema.BaseFieldSchema<"textarea">>
    ) => <FieldInput {...props} name={props.slug} />,
};

const getFieldComponent = (field: BackendFormSchema.SchemaField) => {
    switch (field.type) {
        case "integer":
            return mapFieldToComponent["integer"](field);

        case "textarea":
            return mapFieldToComponent["textarea"](field);

        case "dropdown":
            return mapFieldToComponent["dropdown"](field);

        case "text":
            return mapFieldToComponent["text"](field);
    }

    // code only reachable when unsupported field type is received from API
    return <></>;
};

const isConditionVisibility = (condition: BackendFormSchema.FieldCondition) =>
    condition.type === "visible";

const isPassingOrRuleSet = (
    formValues: unknown,
    ruleSet: Array<BackendFormSchema.ConditionRule>
): boolean =>
    // pass as true for empty rule arrays
    !ruleSet.length || ruleSet.some(isPassingConditionRule(formValues));

const isPassingConditionRule =
    (formValues: unknown) =>
    (rule: BackendFormSchema.ConditionRule): boolean => {
        // TODO: rule.field is actually always defined when rule.type=='equal'. FIX TYPES
        if (rule.type === "equal" && rule.field) {
            return getIn(formValues, rule.field) === rule.value;
        }

        if (rule.type === "or") {
            return isPassingOrRuleSet(formValues, rule.rules || []);
        }

        return false;
    };

const FormBuilderInputs: React.FC = () => {
    const { values } = useFormikContext();

    const isFieldVisible = (field: BackendFormSchema.SchemaField): boolean => {
        const visibilityCondition = field.conditions?.find(
            isConditionVisibility
        );

        if (visibilityCondition) {
            return visibilityCondition.rules.every(
                isPassingConditionRule(values)
            );
        }

        return true;
    };

    return (
        <div>
            {exampleBackendSchema.filter(isFieldVisible).map(field => (
                <FieldWrapper
                    label={field.title}
                    key={field.slug}
                    name={field.slug}
                >
                    {getFieldComponent(field)}
                </FieldWrapper>
            ))}
        </div>
    );
};

export const FormBuilder: React.FC<{ schema: BackendFormSchema.Schema }> = ({
    schema,
}) => {
    const buildSchema = React.useMemo(
        () => buildYupSchemaFromJson(schema),
        [schema]
    );

    return (
        <Formik
            validateOnBlur={true}
            validateOnChange={true}
            validationSchema={buildSchema}
            onSubmit={(values, helper) => {
                helper.setSubmitting(false);
            }}
            initialValues={{}}
        >
            <Form>
                <FormBuilderInputs />
                <Button color="primary" type="submit" className="w-full">
                    Submit
                </Button>
                <Errors />
            </Form>
        </Formik>
    );
};
