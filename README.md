# loadable

Like [`react-loadable`](https://github.com/jamiebuilds/react-loadable), but
better.

[![npm](https://img.shields.io/npm/v/@thejohnfreeman/loadable.svg)](https://www.npmjs.com/package/@thejohnfreeman/loadable)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@thejohnfreeman/loadable.svg?style=flat)](https://bundlephobia.com/result?p=@thejohnfreeman/loadable)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![build status](https://travis-ci.org/thejohnfreeman/loadable.svg?branch=master)](https://travis-ci.org/thejohnfreeman/loadable)


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


## Usage

[Code splitting](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/code-splitting/):

```typescript
import loadable from '@thejohnfreeman/loadable'
const Proxy = loadable()(() => import('./Target'))
// <Proxy />
```

Resource loading:

```typescript
import loadable from '@thejohnfreeman/loadable'
const AsyncProduct = loadable()(async ({ productId }) => {
  try {
    const product = await backend.getProduct(productId)
  } catch (error) {
    return <Error error={error} />
  }
  return <Product product={product} />
})
// <AsyncProduct productId={productId} />
```

## Options

Options are passed to the call to `loadable`, not to the function it returns,
which takes the `load` function.

- `delay :: number`

  Number of milliseconds to wait before showing the placeholder (to avoid
  a flicker of content). The default is 200.

- `Placeholder :: React.ComponentType`

  The placeholder component type to show while waiting for the target. It will
  be given the same props as the target, in case you want to make use of them.
  The default is the text "Loading...".
