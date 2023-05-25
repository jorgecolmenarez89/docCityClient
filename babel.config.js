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
  ],
};
