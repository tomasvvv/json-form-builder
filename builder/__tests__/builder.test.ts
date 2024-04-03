import { buildYupSchemaFromJson } from "../schema-builder";

describe("form-builder/schema-builder", () => {
    it("should build a base Yup schema", () => {
        const schema = buildYupSchemaFromJson([
            {
                type: "integer",
                slug: "id-int",
                title: "Integer input",
            },
        ]);

        expect(() =>
            schema.validateSync({
                "id-int": "test",
                "unknown-field": 33,
            })
        ).toThrow();

        expect(() =>
            schema.validateSync({
                "id-int": 23,
                "unknown-field": 33,
            })
        ).not.toThrow();
    });

    it("should pass basic or check");

    it("should pass equal with correct values");
    it("should not pass equal with incorrect values");

    it("should pass visibility when rules is empty");
    it("should not pass visibility when rules is not empty");
    it("should pass visibility when rules is not empty");

    it("should pass required when rules is empty");
    it("should not pass required when rules is not empty");
    it("should pass required when rules is not empty");
});
