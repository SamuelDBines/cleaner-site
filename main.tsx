import React from "react";
import { createRoot } from 'react-dom/client';
import Button from './src/ui/components/Button';
type PokemonProps = {
  name?: string;
};

function Pokemon() {
  const [counter, setCounter] = React.useState(0);
  return <div onClick={() => {
    console.log('here');
    setCounter(counter + 2);
  }}>Bun Forrest, Bun! {counter}
    <Button></Button></div>;
}

export default Pokemon;

// tslint:disable-next-line:no-unused-expression
const root = createRoot(document.getElementById('app')!);
root.render(<Pokemon />);