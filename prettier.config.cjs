/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig } */
const config = {
  arrowParens: "always",
  printWidth: 120,
  singleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  proseWrap: "always", // printWidth line breaks in md/mdx
};

module.exports = config;
