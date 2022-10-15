import { defineConfig } from "vite";
import { createVuePlugin as vue2 } from "vite-plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vue-a11y-utils/examples/",
  plugins: [vue2()],
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm.js"
    }
  },
  build: {
    outDir: "docs/examples"
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
