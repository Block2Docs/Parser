import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["src/js/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
        },
    },
    {
        files: ["src/js/cli/**/*.js"],
        languageOptions: {
            globals: {
                process: "readonly",
            },
        },
    },
    {
        ignores: ["node_modules/", "vendor/"],
    },
];
