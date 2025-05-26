/**
 * Custom webpack configuration for SPFx
 * This adds support for Web Workers in the SharePoint Framework
 */
const path = require('path');

// This configuration extends the SPFx webpack config
module.exports = {
  // Customize the webpack config, adding worker-loader support
  additionalLoaders: [
    {
      test: /\.worker\.ts$/,
      use: [
        {
          loader: 'worker-loader',
          options: {
            filename: '[name].[contenthash].worker.js',
            publicPath: './',
            inline: 'fallback', // Use fallback to inline workers when possible
          },
        },
      ],
    },
  ],
  
  // Support web worker chunks
  additionalStaticAssets: [],
  
  // Make sure workers can import TypeScript modules
  extendWebpackConfig: (config) => {
    // Find TypeScript rule
    const tsRule = config.module.rules.find(rule => {
      return rule.test && rule.test.toString().includes('.ts');
    });
    
    if (tsRule && tsRule.use) {
      // Clone the TypeScript rule for workers
      const workerTsRule = JSON.parse(JSON.stringify(tsRule));
      
      // Add it to the rules
      config.module.rules.push(workerTsRule);
    }
    
    // Add resolve.fallback for worker polyfills
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    
    // Polyfills for web workers
    config.resolve.fallback.worker_threads = false;
    
    return config;
  }
};
