const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add more watch folders
config.watchFolders = [...(config.watchFolders || []), './lib'];

// Add resolver aliases if needed
config.resolver.extraNodeModules = {
  lib: `${__dirname}/lib`,
};

module.exports = config;