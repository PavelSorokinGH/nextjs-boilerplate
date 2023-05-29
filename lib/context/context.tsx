import { Wrapper } from '@/components/Wrapper';
import { createContext, useContext, useState } from 'react';

interface AppContextData {
  value: string;
  setValue: (_value: string) => void;
}

const AppContext = createContext<AppContextData | null>(null);

export const AppProvider = AppContext.Provider;

interface AppConsumerProps {
  children: (_data: AppContextData) => React.ReactElement;
}
const useAppContext = () => {
  const data = useContext(AppContext);

  if (!data) {
    throw new Error('You cannot use UseAppContext outside of AppProvider');
  }

  return data;
};

const AppConsumer = (props: AppConsumerProps) => {
  const data = useAppContext();

  return props.children(data);
};

const Form = () => {
  return (
    <Wrapper
      title="Form"
      as="form"
      style={{
        width: 300,
        height: 150,
      }}
    >
      <FormInput />
    </Wrapper>
  );
};

const FormInput = () => {
  const { setValue } = useAppContext();

  return (
    <Wrapper title="FormInput">
      <input type="text" onChange={(e) => setValue(e.target.value)} />
    </Wrapper>
  );
};

const Text = () => {
  const { value } = useAppContext();

  return <Wrapper title="Text">{value}</Wrapper>;
};

const TextDisplay = () => {
  return (
    <Wrapper title="TextDisplay">
      <Text />
      <TextConsumer />
    </Wrapper>
  );
};

const TextConsumer = () => {
  return (
    <AppConsumer>
      {({ value }) => <Wrapper title="TextConsumer">{value}</Wrapper>}
    </AppConsumer>
  );
};

export const Recommended = () => {
  const [value, setValue] = useState('');

  <AppProvider value={{ value, setValue }}>
    <Form />
    <TextDisplay />
  </AppProvider>;
};
