import { Wrapper } from '@/components/Wrapper';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

class ReducedStore<T> {
  private subscriptions: Set<() => void> = new Set<() => void>();
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = () => {
    return this.state;
  };

  update = (partialNewState: Partial<T>) => {
    this.state = { ...this.state, ...partialNewState };

    this.subscriptions.forEach((cb) => {
      cb();
    });
  };

  subscribe = (cb: () => void) => {
    this.subscriptions.add(cb);

    return () => {
      this.subscriptions.delete(cb);
    };
  };
}

const useRenderCount = () => {
  const count = useRef(0);

  count.current++;

  return count.current;
};

interface AppContextData {
  value: string;
}

function createOptimizedContext<T>() {
  const Context = createContext<ReducedStore<T> | null>(null);

  const Provider = ({
    initialState,
    children,
  }: {
    initialState: T;
    children: ReactNode;
  }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => new ReducedStore(initialState), []);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const store = useContext(Context);

    if (!store) {
      throw new Error('Can not use `useStore` outside of the `Provider`');
    }

    return store;
  };

  const useStateSelector = <Result extends any>(
    selector: (_state: T) => Result
  ): Result => {
    const store = useStore();
    const [state, setState] = useState(selector(store.getState()));
    const selectorRef = useRef(selector);
    const stateRef = useRef(state);

    useIsomorphicLayoutEffect(() => {
      selectorRef.current = selector;
      stateRef.current = state;
    });

    useEffect(() => {
      return store.subscribe(() => {
        const state = selectorRef.current(store.getState());

        if (stateRef.current === state) {
          return;
        }

        setState(state);
        console.log('Layout 2');
      });
    }, [store]);

    return state;
  };

  const useUpdate = () => {
    const store = useStore();
    return store.update;
  };

  return { Provider, useStateSelector, useUpdate };
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const {
  Provider: AppProvider,
  useStateSelector,
  useUpdate,
} = createOptimizedContext<AppContextData>();

// const AppContext = createContext<AppContextData | null>(null);

// export const AppProvider = AppContext.Provider;

// interface AppConsumerProps {
//   children: (_data: AppContextData) => React.ReactElement;
// }
// const useAppContext = () => {
//   const data = useContext(AppContext);

//   if (!data) {
//     throw new Error('You cannot use UseAppContext outside of AppProvider');
//   }

//   return data;
// };

// const AppConsumer = (props: AppConsumerProps) => {
//   const data = useAppContext();

//   return props.children(data);
// };

const Form = () => {
  const renderCount = useRenderCount();
  return (
    <Wrapper
      title="Form"
      as="form"
      style={{
        width: 300,
        height: 150,
      }}
    >
      <div>Render count: {renderCount}</div>
      <FormInput />
    </Wrapper>
  );
};

const FormInput = () => {
  // const { setValue } = useAppContext();
  const updateValue = useUpdate();
  const renderCount = useRenderCount();

  return (
    <Wrapper title="FormInput">
      <div>Render count: {renderCount}</div>
      <input
        type="text"
        onChange={(e) => updateValue({ value: e.target.value })}
      />
    </Wrapper>
  );
};

const Text = () => {
  // const { value } = useAppContext();
  const renderCount = useRenderCount();
  const value = useStateSelector((state) => state.value);

  return (
    <Wrapper title="Text">
      Render Count: {renderCount}
      {value}
    </Wrapper>
  );
};

const TextDisplay = () => {
  const renderCount = useRenderCount();
  return (
    <Wrapper title="TextDisplay">
      Render Count: {renderCount}
      <Text />
      {/* <TextConsumer /> */}
    </Wrapper>
  );
};

// const TextConsumer = () => {
//   return (
//     <AppConsumer>
//       {({ value }) => <Wrapper title="TextConsumer">{value}</Wrapper>}
//     </AppConsumer>
//   );
// };

export const Optimized = () => {
  // const [value, setValue] = useState('');  remove state from the component but if state is needed it have to be memoized

  /*some changes in AppProvider value*/
  return (
    <AppProvider initialState={{ value: '' }}>
      <Form />
      <TextDisplay />
    </AppProvider>
  );
};
