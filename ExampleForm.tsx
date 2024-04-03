import React from "react";

import { FormBuilder } from "components/form-builder";
import { exampleBackendSchema } from "./example-schema";

export const ExampleForm: React.FC = () => {
    return (
        <FormBuilder schema={exampleBackendSchema} />
    );
};
