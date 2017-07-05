const webpack = require('webpack');

// next.config.js
module.exports = {
  distDir: 'dist',
  webpack: (config, { dev }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    return config;
  },
};
