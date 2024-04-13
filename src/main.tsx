import React from "react";
import { createRoot } from 'react-dom/client';

function App() {
  return <div> hey there</div>;
}

// tslint:disable-next-line:no-unused-expression
const root = createRoot(document.getElementById('app')!);
root.render(<App />);
