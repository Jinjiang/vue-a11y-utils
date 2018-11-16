<template>
  <div id="app" class="content">
    <h1>Vue A11y Utils Examples</h1>
    <a href="https://jinjiang.github.io/vue-a11y-utils/">Homepage</a> | <a href="https://github.com/jinjiang/vue-a11y-utils/">GitHub</a>
    <h2>VueAria Component</h2>
    <ExampleAria></ExampleAria>
    <h2>KeyTravel Mixin</h2>
    <ExampleKeyTravel ></ExampleKeyTravel>
    <h2>ID Mixin</h2>
    <ExampleId></ExampleId>
    <h2>VueFocusTrap Component</h2>
    <ExampleFocusTrap></ExampleFocusTrap>
    <h2>KeyShortcuts Mixin</h2>
    <ExampleKeyShortcuts></ExampleKeyShortcuts>
    <h2>VueLive Component</h2>
    <VueLive>
      <ExampleLive></ExampleLive>
    </VueLive>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ExampleAria from "./aria.vue";
import ExampleKeyTravel from "./travel.vue";
import ExampleId from "./id.vue";
import ExampleFocusTrap from "./focus-trap.vue";
import ExampleKeyShortcuts from "./shortcuts.vue";
import ExampleLive from "./live.vue";
import { VueLive } from "../src/index";

@Component({
  components: {
    ExampleAria,
    ExampleKeyTravel,
    ExampleId,
    ExampleFocusTrap,
    ExampleKeyShortcuts,
    ExampleLive,
    VueLive
  }
})
export default class Example extends Vue {}
</script>

<style lang="stylus">
// via: VuePress https://vuepress.vuejs.org/

// colors
$accentColor = #3eaf7c
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
$arrowBgColor = #ccc

// layout
$navbarHeight = 3.6rem
$sidebarWidth = 20rem
$contentWidth = 740px

// responsive breakpoints
$MQNarrow = 959px
$MQMobile = 719px
$MQMobileNarrow = 419px

// code
$lineNumbersWrapperWidth = 3.5rem
$codeLang = js ts html md vue css sass scss less stylus go java c sh yaml py

html, body
  padding 0
  margin 0

body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  font-size 16px
  color $textColor

a
  font-weight 500
  color $accentColor
  text-decoration none

p a code
  font-weight 400
  color $accentColor

kbd
  background #eee
  border solid 0.15rem #ddd
  border-bottom solid 0.25rem #ddd
  border-radius 0.15rem
  padding 0 0.15em

blockquote
  font-size 1.2rem
  color #999
  border-left .25rem solid #dfe2e5
  margin-left 0
  padding-left 1rem

ul, ol
  padding-left 1.2em

strong
  font-weight 600

h1, h2, h3, h4, h5, h6
  font-weight 600
  line-height 1.25
  .content:not(.custom) > &
    margin-top (0.5rem - $navbarHeight)
    padding-top ($navbarHeight + 1rem)
    margin-bottom 0
    &:first-child
      margin-top -1.5rem
      margin-bottom 1rem
      + p, + pre, + .custom-block
        margin-top 2rem
  &:hover .header-anchor
    opacity: 1

h1
  font-size 2.2rem

h2
  font-size 1.65rem
  padding-bottom .3rem
  border-bottom 1px solid $borderColor

h3
  font-size 1.35rem

a.header-anchor
  font-size 0.85em
  float left
  margin-left -0.87em
  padding-right 0.23em
  margin-top 0.125em
  opacity 0
  &:hover
    text-decoration none

code, kbd, .line-number
  font-family source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace

p, ul, ol
  line-height 1.7

hr
  border 0
  border-top 1px solid $borderColor

table
  border-collapse collapse
  margin 1rem 0
  display: block
  overflow-x: auto

tr
  border-top 1px solid #dfe2e5
  &:nth-child(2n)
    background-color #f6f8fa

th, td
  border 1px solid #dfe2e5
  padding .6em 1em


.content {
  max-width $contentWidth
  margin 0 auto
  padding 2rem 2.5rem
}

input[type="text"],
input[type="email"],
input[type="password"]
  display inline-block
  font-size 0.9rem
  color lighten($textColor, 25%)
  width 10rem
  line-height 2rem
  border 1px solid darken($borderColor, 10%)
  padding 0 1rem
  border-radius 2rem
  transition border-color .1s ease
  box-sizing border-box
  &:focus
    border-color $accentColor

button,
.button
  display inline-block
  font-size 1.2rem
  color #fff
  margin 2px
  line-height normal
  background-color $accentColor
  border: 0
  padding 0.8rem 1.6rem
  border-radius 4px
  transition background-color .1s ease
  box-sizing border-box
  border-bottom 1px solid darken($accentColor, 10%)
  &:hover
    background-color lighten($accentColor, 10%)
</style>
