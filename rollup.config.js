import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/vue-a11y-utils.js",
    format: "esm"
  },
  external: ["vue"],
  plugins: [
    nodeResolve({ jsnext: true }),
    commonjs(),
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: "es2015"
    }),
    vue()
  ]
};
