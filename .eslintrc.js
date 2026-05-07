
module.exports = {
  root: true,
  ignorePatterns: ["**/*.module.scss.ts"],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', '@rushstack'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  rules: {
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Require chunk names for dynamic imports in SPFx projects. https://www.npmjs.com/package/@rushstack/eslint-plugin
    '@rushstack/import-requires-chunk-name': 1,
    // Ensure that React components rendered with ReactDOM.render() are unmounted with ReactDOM.unmountComponentAtNode(). https://www.npmjs.com/package/@rushstack/eslint-plugin
    '@rushstack/pair-react-dom-render-unmount': 1,

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
