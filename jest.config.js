/** @type {import('jest').Config} */
const config = {
  verbose: true,
  injectGlobals: false,
  transform: {},
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Test Report",
      includeFailureMsg: true,
      includeStackTrace: true

    }]
  ]
};

export default config