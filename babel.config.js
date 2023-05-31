module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './components',
          '@atoms': ['./components/atoms'],
          '@organisms': ['./components/organisms'],
          '@assets': ['./assets'],
          '@config': ['./config'],
          '@context': ['./context'],
          '@helpers': ['./helpers'],
          '@hooks': ['./hooks'],
          '@navigation': ['./navigation'],
          '@screens': ['./screens'],
          '@services': ['./services'],
          '@models': ['./models'],
        },
      },
    ],
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.svg'],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        blacklist: null, // DEPRECATED
        whitelist: null, // DEPRECATED
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
