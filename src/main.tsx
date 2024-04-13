import React from "react";
import { createRoot } from 'react-dom/client';

function App() {
  return <div> Okay cool </div>;
}

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM loaded");
  var evtSource = new EventSource("/watcher");


  evtSource.onmessage = function (event) {
    console.log("message received", event);
  };

  evtSource.addEventListener("reload", function (event) {
    console.log("reload event", event);
    // location.reload();
    // Optionally handle the event
  });

  evtSource.onerror = function (event) {
    location.reload();
  };
});



// tslint:disable-next-line:no-unused-expression
const root = createRoot(document.getElementById('app')!);
root.render(<App />);

