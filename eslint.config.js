import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist", "target", "node_modules"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
        },
        rules: {
            "@typescript-eslint/semi": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-shadow": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE", "PascalCase"],
                },
            ],
            "import/prefer-default-export": "off",
            "import/no-cycle": "off",
            "import/no-extraneous-dependencies": "off",
            "no-param-reassign": "off",
            "no-unused-vars": "off",
            "no-console": "off",
            "jsx-quotes": "off",
            semi: "off",
        },
    },
);
