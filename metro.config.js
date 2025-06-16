// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for the "unknown" file errors - disable symbolication
config.symbolicator = {
  customizeFrame: frame => {
    // Filter out frames with unknown file paths
    if (!frame.file || frame.file === 'unknown') {
      return null;
    }
    return frame;
  }
};

// Add web platform extensions
config.resolver.sourceExts.push('mjs', 'web.js', 'web.ts', 'web.tsx');

// Configure sourcemap generation to avoid issues
config.transformer.sourceMap = false;

module.exports = config;

