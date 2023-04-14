import moduleTools, { defineConfig } from '@modern-js/module-tools';

export default defineConfig({
  plugins: [moduleTools()],
  buildPreset({ extendPreset }) {
    return extendPreset('npm-library', {
      input: ['./src/index.js'],
    });
  },
});
