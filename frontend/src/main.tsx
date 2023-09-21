import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import FormPage from "./pages/form";
import ResultPage from "./pages/result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FormPage />,
  },
  {
    path: "/result",
    element: <ResultPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <nav className="flex bg-gray-400 p-2">
      <div>
        <span>ペネトレのシナリオ作成する君</span>
      </div>
    </nav>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
