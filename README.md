# async-component

Like [`react-loadable`](https://github.com/jamiebuilds/react-loadable), but
better.

[![npm](https://img.shields.io/npm/v/@thejohnfreeman/async-component.svg)](https://www.npmjs.com/package/@thejohnfreeman/async-component)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![build status](https://travis-ci.org/thejohnfreeman/async-component.svg?branch=master)](https://travis-ci.org/thejohnfreeman/async-component)


## Motivation

`react-loadable` has some problems. As of this writing, there are 39 open pull
requests and issues are closed. The creator and maintainer seems to have
abandoned the project, perhaps in favor of
[`@loadable/component`](https://www.smooth-code.com/open-source/loadable-components/),
but perhaps because of [his emotional instability](https://archive.fo/0ZYam).

The general idea of `react-loadable` is that you give it an async function,
`load`, that returns a component type (not a component or element), `Target`,
and it will give you a new component type, `Proxy`. The first time an element
of `Proxy` is rendered, it will save its props, call `load`, and return
a placeholder "loading" element while it waits. Once `load` returns with
`Target`, the proxy component will update itself with an element of type
`Target`, passing along the props it saved.

What I wanted initially, was the ability to use the props in my `load`
function, but [even `@loadable/component` has
that](https://www.smooth-code.com/open-source/loadable-components/docs/dynamic-import/).
What I want now is to pass an async function that takes the props and returns
an element, not just the component type. Then I can use it for fetching
resources, not just for code-splitting.
