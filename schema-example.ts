import { BackendFormSchema } from "./types";

export const exampleBackendSchema: BackendFormSchema.Schema = [
    {
        title: "Reason of cancellation",
        slug: "reason_of_cancellation",
        type: "dropdown",
        required: true,
        options: [
            {
                title: "Freight is sold",
                slug: "freight_is_sold",
            },
            {
                title: "Freight is not ready",
                slug: "freight_is_not_ready",
            },
            {
                title: "Other",
                slug: "other",
            },
        ],
        conditions: [
            { type: "visible", rules: [] },
            { type: "required", rules: [] },
        ],
    },
    {
        title: "Rate of the delivery",
        slug: "rate_of_the_delivery",
        type: "integer",
        format: "currency",
        validations: {
            min: 15000,
            max: 2000000,
        },
        conditions: [
            {
                type: "visible",
                rules: [
                    {
                        type: "equal",
                        field: "reason_of_cancellation",
                        value: "freight_is_sold",
                    },
                ],
            },
            {
                type: "required",
                rules: [
                    {
                        type: "equal",
                        field: "reason_of_cancellation",
                        value: "freight_is_sold",
                    },
                ],
            },
        ],
    },
    {
        title: "Comment",
        slug: "comment",
        type: "textarea",
        conditions: [
            {
                type: "visible",
                rules: [
                    {
                        type: "or",
                        rules: [
                            {
                                type: "equal",
                                field: "reason_of_cancellation",
                                value: "freight_is_sold",
                            },
                            {
                                type: "equal",
                                field: "reason_of_cancellation",
                                value: "other",
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
