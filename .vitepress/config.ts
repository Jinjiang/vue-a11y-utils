import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/vue-a11y-utils/",
  title: "Vue A11y Utils",
  titleTemplate: false,
  description: "Utilities for accessibility (a11y) in Vue.js",

  outDir: "docs",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Examples",
        link: "https://jinjiang.github.io/vue-a11y-utils/examples/"
      }
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Jinjiang/vue-a11y-utils"
      }
    ]
  }
});
