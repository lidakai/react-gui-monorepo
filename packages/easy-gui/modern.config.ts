import path from 'path';
import moduleTools, { defineConfig } from '@modern-js/module-tools';
import moduleImport from '@modern-js/plugin-module-import';
import antdTheme from './antd-theme';

export default defineConfig({
  plugins: [
    moduleTools(),
    moduleImport({
      pluginImport: [
        {
          libraryName: '@easyv/antd',
          style: true,
        },
      ],
    }),
  ],
  buildPreset({ extendPreset }) {
    return extendPreset('npm-component', {
      alias: {
        'easy-gui': path.resolve(__dirname, './src/components/easy-gui'),
        modules: path.resolve(__dirname, './src/components'),
        'config-provider': path.resolve(
          __dirname,
          './src/components/config-provider',
        ),
        layout: path.resolve(__dirname, './src/components/layout'),
        'config-types': path.resolve(
          __dirname,
          './src/components/config-types',
        ),
        'easy-design': path.resolve(__dirname, './src/components/easy-design'),
      },
      input: ['./src/index.jsx'],
      externals: ['easy-utils', '@easyv/antd', 'lodash', 'React', 'react-dom'],
      style: {
        modules: {
          localsConvention: 'camelCaseOnly',
        },
        less: {
          additionalData: JSON.stringify(antdTheme)
            .replace(/"|{|}/g, '')
            .replace(/,/, ';'),
        },
      },
    });
  },
  // buildConfig: {
  //   alias: {
  //     'config-provider': path.resolve(
  //       __dirname,
  //       './src/components/config-provider',
  //     ),
  //     'easy-gui': path.resolve(__dirname, './src/components/easy-gui'),
  //     modules: path.resolve(__dirname, './src/components'),
  //     layout: path.resolve(__dirname, './src/components/layout'),
  //     'config-types': path.resolve(__dirname, './src/components/config-types'),
  //     'easy-design': path.resolve(__dirname, './src/components/easy-design'),
  //   },
  //   minify: {
  //     compress: {
  //       drop_console: true,
  //     },
  //   },
  //   format: 'esm',
  //   target: 'es6',
  //   platform: 'browser',
  //   style: {
  //     modules: {
  //       localsConvention: 'camelCaseOnly',
  //     },
  //     less: {
  //       additionalData: JSON.stringify(antdTheme)
  //         .replace(/"|{|}/g, '')
  //         .replace(/,/, ';'),
  //     },
  //   },
  //   input: ['src/index.jsx'],
  //   externals: ['easy-utils', '@easyv/antd', 'lodash', 'React', 'react-dom'],
  // },
});
