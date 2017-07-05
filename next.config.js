const path = require('path');
const webpack = require('webpack');

// next.config.js
module.exports = {
  distDir: 'dist',
  webpack: (config, { dev }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    config.resolve.modules.push(path.resolve(__dirname, './redux'));
    config.resolve.modules.push(path.resolve(__dirname, './shared'));

    return config;
  },
};
