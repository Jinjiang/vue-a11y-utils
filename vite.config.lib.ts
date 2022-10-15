import { resolve } from "path";
import { defineConfig } from "vite";
import { createVuePlugin as vue2 } from "vite-plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue2()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueA11yUtils",
      fileName: "vue-a11y-utils"
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
