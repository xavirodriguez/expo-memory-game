//import type { UserConfig } from 'i18next-scanner';

const config = {
  input: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.spec.{ts,tsx}",
    "!**/node_modules/**",
  ],
  output: './locales/',
  options: {
    debug: false,
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.ts', '.tsx']
    },
    lngs: ['en', 'es'],
    defaultLng: 'en',
    defaultNs: 'translation',
    resource: {
      loadPath: '{{lng}}/{{ns}}.json',
      savePath: '{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: ':',
    keySeparator: '.',
  },
};

export default config;