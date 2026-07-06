const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the whole monorepo (in addition to Expo's own defaults) so changes
// to the shared package are picked up.
config.watchFolders = [...config.watchFolders, workspaceRoot];

// Resolve modules from both this app's own node_modules and the hoisted
// workspace root node_modules (where the shared package is symlinked).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
