import { defineConfig } from "vite";
import { createVuePlugin as vue2 } from "vite-plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm.js"
    }
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
