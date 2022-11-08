export default {
  base: "/vue-a11y-utils/",
  title: "Vue A11y Utils",
  titleTemplate: false,
  description: "Utilities for accessibility (a11y) in Vue.js",
  themeConfig: {
    nav: [
      { text: "For Vue 3", link: "/" },
      { text: "For Vue 2", link: "/for-vue2" },
      {
        text: "Examples",
        link: "/examples/",
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/jinjiang/vue-a11y-utils",
      },
    ],
    editLink: {
      pattern:
        "https://github.com/jinjiang/vue-a11y-utils/edit/main/docs-src/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2018-present Jinjiang",
    },
  },
};
