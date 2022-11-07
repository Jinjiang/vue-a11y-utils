# Vue A11y Utils

<div style="display: flex; align-items: center;">
  <img src="https://vuejs.org/images/logo.png" width="200" height="200" />
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" x="0" y="0" viewBox="-3627 353 1024 1024" style="enable-background:new -3627 353 1024 1024;"><circle cx="-3115" cy="865" r="512" fill="#4dba87"></circle><path d="M-3116.4 353c-282 0-510.6 228.6-510.6 510.6s228.6 510.6 510.6 510.6s510.6-228.6 510.6-510.6S-2834.4 353-3116.4 353z M-3124.1 454.4c36.6 0 66.2 29.6 66.2 65.9c0 36.6-29.6 66.2-66.2 66.2c-36.3 0-65.9-29.6-65.9-66.2 C-3190.1 484-3160.5 454.4-3124.1 454.4L-3124.1 454.4z M-2838 667.7l-196.4 24.8l0.1 196.6l95.2 317.7c5 20.1-7 40.1-26.9 45.1 c-19.8 5-40.1-6-45.1-26l-97.5-289.2h-30l-89.7 295.2c-7.5 19.3-29 28.1-48.2 20.6c-19.1-7.4-30.7-29.1-23.2-48.4l82.4-311.8V692.5 l-181-24.6c-18.6-1.5-31.2-17.8-29.7-36.4c1.4-18.7 18.3-32.6 36.8-31.1l219.9 18.9h96.4l234.1-19.3c18.6-0.7 34.4 13.7 35 32.5 C-2805 651-2819.4 666.9-2838 667.7L-2838 667.7z" fill="#435466"></path></svg>
</div>

Utilities for accessibility (a11y) in Vue.js

## Table of Contents

- [Why](#why)
- [Getting Started](#getting-started)
- [`<VueAria>` Component](#vuearia-component)
- [`v-aria` Custome Directive](#v-aria-custom-directive)
- [`Travel` Mixin](#travel-mixin)
- [`Id` Mixin](#id-mixin)
- [`<VueFocusTrap>` Component](#vuefocustrap-component)
- [`Shortcuts` Mixin](#shortcuts-mixin)
- [`<VueLive>` Component](#vuelive-component)
- [Further resources](#further-resources)

## Why

TL;DR: when you write a Vue app with full accessibility, you may meet some common issues to deal with. So we built this project to help you.

<details>

### Background

As the [(WIP) Vue accessibility guide page](https://github.com/vuejs/vuejs.org/pull/1002) says:

> The World Health Organization estimate that 15% of the world's population has some form of disability, 2-4% of them severely so ... which can be divided roughly into four categories: _visual impairments_, _motor impairments_, _hearing impairments_ and _cognitive impairments_.

_table: issues for different impairments_

| visual  | motor              | hearing | cognitive                    |
| ------- | ------------------ | ------- | ---------------------------- |
| 🖥 🔎 🎨 | 🖱 📱 ⌨️ 🕹 🎮 🎙 🖊 🎛 | 🔈      | content, layout, interaction |

Or there are also some accessibility issues for a normal person in such a situation like driving a car, having a meeting, using a mobile device with a bluetooth keyboard etc.

So actually accessibility is not just for the "less amount of people", but for almost everyone.

But some mistakes we often make in a real project like:

- Mouse-only in a desktop app
- Touch-only in a mobile app
- Remote-control-only in a TV app
- Operation through keyboard only is not possible or with low efficiency
- No text alternative for non-text content
- Have no fallback way for the creative interaction like e-pencil, audio input, face ID, touch ID, NFC etc.
- The color contrast is not enough

Each of them might make user confused, block the user flow or lead user to a no-way-out trap in some certain cases.

### Web Standards

However, there are already some web standards and best practice to follow which let developers do it better.

In W3C there are 3 main parts of accessibility standards:

![WAI standard overview](https://www.w3.org/WAI/content-images/wai-std-gl-overview/specs.png)  
via: [W3C Accessibility Standards Overview](https://www.w3.org/WAI/standards-guidelines/)

- [WCAG](https://www.w3.org/TR/WCAG20/): about web content, targeting websites.
- [UAAG](https://www.w3.org/TR/UAAG20/): about user agent, targeting browsers, screen readers etc.
- [ATAG](https://www.w3.org/TR/ATAG20/): about authoring tools, targeting CMS, WYSIWYG editor etc.

and a technical spec which is commonly used:

- [WAI-ARIA](https://w3c.github.io/aria/): targeting web app.

For web developers, we may pay more attention on WCAG and WAI-ARIA. At the same time, we should know which user agents people use most and how about their support and compatibility to the standard.

Here is a survey about most common screen reader and browser combinations table:

| Screen Reader & Browser     | # of Respondents | % of Respondents |
| --------------------------- | ---------------- | ---------------- |
| JAWS with Internet Explorer | 424              | 24.7%            |
| NVDA with Firefox           | 405              | 23.6%            |
| JAWS with Firefox           | 260              | 15.1%            |
| VoiceOver with Safari       | 172              | 10.0%            |
| JAWS with Chrome            | 112              | 6.5%             |
| NVDA with Chrome            | 102              | 5.9%             |
| NVDA with IE                | 40               | 2.3%             |
| VoiceOver with Chrome       | 24               | 1.4%             |
| Other combinations          | 180              | 10.5%            |

_via [Screen Reader User Survey by webaim.org](https://webaim.org/projects/screenreadersurvey7/#browsercombos)_

### Common Issues

When you write a Vue app with full accessibility. You may meet some issues frequently. For example:

- Making sure the [W3C WAI-ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) roles & properties of each DOM element are set properly.
- Controling the _focus_ and finish every use case elegantly only through _keyboard_.
- Using a central [live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) to read messages right now in a screen reader.
- Sometimes you need set a _ID reference_ or _ID reference list_ type aria attribute with _ID_ of another DOM element. But we don't use _ID_ in Vue to identify a DOM element right?

So that's why **Vue A11y Utils** is trying to supply a group of utilities to help Vue developers finish these jobs easier.

</details>

## Getting Started

### Install

```bash
npm install vue-a11y-utils
```

or

```bash
yarn add vue-a11y-utils
```

### Import

```js
// choose the utils you need
import {
  ariaToAttrs,
  getTabindexByRole,
  Live,
  useLive,
  FocusTrap,
  genId,
  useTravel,
  useHotkey,
  useGlobalHotkey,
} from "vue-a11y-utils";
```

### Usage

See the docs below or preview some [examples](https://github.com/Jinjiang/vue-a11y-utils/tree/master/examples) [online](https://jinjiang.github.io/vue-a11y-utils/examples).

For more complicated examples, there is another repo in [`Jinjiang/vue-a11y-examples`](https://github.com/Jinjiang/vue-a11y-examples/) you can [preview online](https://jinjiang.github.io/vue-a11y-examples/). (currently based on v0.8.x and below)

## APIs

### Keyboard travel utils

### Hotkey utils

### Focus trap utils

### Id utils

### Aria utils

### Live utils

## Further resources

- [Vue I18n](https://kazupon.github.io/vue-i18n/): the internationalization plugin for Vue.js.
- [Vue A11y](https://vue-a11y.com/): Vue.js community effort to improve web accessibility.
