module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "semi": ["error", "never"],
        "quotes": ["error", "single"],
        "max-len": [
            "error",
            {
                "code": 120,
                "ignoreStrings": true,
                "ignoreComments": true,
                "ignoreTemplateLiterals": true
            }
        ],
        "no-useless-escape": "off",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "arrow-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "space-infix-ops": "error",
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "object-curly-spacing": [
            "error",
            "always",
            {
                "arraysInObjects": false,
                "objectsInObjects": true
            }
        ],
        "array-bracket-spacing": ["error", "never"],
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "key-spacing": [
            "error",
            {
                "afterColon": true
            }
        ],
        "space-before-blocks": [
            "error",
            {
                "functions": "always",
                "keywords": "always",
                "classes": "always"
            }
        ],
        "no-trailing-spaces": [
            "error",
            {
                "ignoreComments": true
            }
        ],
        "no-multi-spaces": "error",
        "no-restricted-imports": "error",
        "space-before-function-paren": ["error", { "anonymous": "never", "named": "never", "asyncArrow": "always" }],
        "computed-property-spacing": ["error", "never"]
    }
}
