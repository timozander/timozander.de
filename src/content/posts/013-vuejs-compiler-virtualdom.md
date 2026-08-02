---
title: "Speeding Up the Virtual DOM With Vue.js"
description:
  "Web frameworks often use a virtual DOM to keep track of current UI elements.
  To combat performance issues, Vue.js closely couples its runtime and compiler."
published: 2024-07-13
category: Elsewhere
lang: en
source: "heise Developer"
externalUrl: "https://www.heise.de/hintergrund/Speeding-Up-the-Virtual-DOM-With-Vue-js-9799410.html"
tags:
  - elsewhere
---

> Originally published at
> [heise Developer](https://www.heise.de/hintergrund/Speeding-Up-the-Virtual-DOM-With-Vue-js-9799410.html).

The concept of a virtual Document Object Model (DOM) was first introduced by the
JavaScript framework React in 2013 and is still used today, both by React and
other frameworks like Vue.js. The idea is to keep an abstract representation of
the website structure in memory to minimize the required number of DOM
manipulations, while making it easier to detect changes. In practice, this
requires two steps: The source code must be parsed to create a virtual DOM tree,
and with any change of data that necessitates a component to update its
appearance, both the virtual DOM and the DOM must be updated.

Timo Zander studied Applied Mathematics and Computer Science and works as a
software developer. He is interested in open source, the JavaScript universe and
emerging technologies.

[Continue reading at heise Developer](https://www.heise.de/hintergrund/Speeding-Up-the-Virtual-DOM-With-Vue-js-9799410.html).
