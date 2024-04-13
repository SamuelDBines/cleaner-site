import React from "react";
import { createRoot } from 'react-dom/client';
import {
  RouterProvider,
} from "react-router-dom";
import router from "@/ui/router";

document.addEventListener('DOMContentLoaded', function () {
  var evtSource = new EventSource("/watcher");
  evtSource.onerror = function (event) {
    location.reload();
  };
});

// tslint:disable-next-line:no-unused-expression
const root = createRoot(document.getElementById('app')!);
root.render(<RouterProvider router={router} />);

