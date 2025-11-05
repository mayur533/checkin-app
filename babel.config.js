module.exports = function(api) {
  api.cache(true);

  const plugins = [];

  // Reanimated plugin must be listed last
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], // If using Expo
      'nativewind/babel' // NativeWind Babel preset
    ],
    plugins,
  };
};

