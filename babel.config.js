module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // The expo-router/babel plugin is deprecated in SDK 50+
    // babel-preset-expo already includes the necessary configuration
    plugins: [
      // Add any other Babel plugins your project needs here
    ],
  };
};

