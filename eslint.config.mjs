import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    "extends": ["prettier"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      indent: ['error', 2],
      'no-multi-spaces': ['error'],
    }
  }
];