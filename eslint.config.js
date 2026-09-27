const js = require("@eslint/js");

module.exports = [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                process: "readonly",
                console: "readonly"
            }
        },
        ...js.configs.recommended
    }
];