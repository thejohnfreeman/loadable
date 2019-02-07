import * as React from 'react'

type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any
  ? U
  : never

const Loading = () => <>Loading...</>

type LoadableOptions = {
  delay?: number
  Placeholder?: React.ComponentType
}

type Imported<P> =
  | React.ReactNode
  | React.ComponentType<P>
  | { default: Imported<P> }

function elementFromImported<P extends object>(
  props: P,
  imported: Imported<P>,
): React.ReactNode {
  if (imported instanceof Function || imported instanceof React.Component) {
    const Component = imported as React.ComponentType<P>
    return <Component {...props} />
  }
  if (imported && typeof imported === 'object' && 'default' in imported) {
    return elementFromImported(props, imported.default)
  }
  return imported
}

// `fetchElement` is an async function that takes props and returns
// a `Promise<JSX.Element>`.
export const loadable = ({
  delay = 200,
  Placeholder = Loading,
}: LoadableOptions = {}) => <
  P extends object,
  F extends (props: P) => Promise<Imported<P>>
>(
  fetchElement: F,
): React.ComponentType<FirstArgument<F>> => {
  class Loadable extends React.Component<FirstArgument<F>> {
    public readonly state = { element: null }

    private timer: any = null

    public componentDidMount() {
      fetchElement(this.props).then(imported => {
        const element = elementFromImported(this.props, imported)
        this.clearTimeout()
        this.setState({ element })
        // console.log('element loaded')
        // console.log(element)
      })
      this.timer = setTimeout(
        // We expect most placeholders to ignore the props,
        // but they can have them anyway, in case they want to
        // give the user an idea of what they're waiting for.
        () => {
          if (this.state.element) {
            console.error('timer was not cleared when element loaded')
          } else {
            this.setState({ element: <Placeholder {...this.props} /> })
            // console.log('timer expired')
          }
        },
        delay,
      )
    }

    public componentWillUnmount() {
      this.clearTimeout()
      // TODO: Cancel promise.
    }

    public render() {
      return this.state.element
    }

    private clearTimeout() {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  return Loadable
}
