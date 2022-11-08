import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vue-a11y-utils/examples/",
  plugins: [vue()],
  build: {
    outDir: "docs/examples",
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
