import { useAtom, useAtomValue } from "jotai";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  loadingStateAtom,
  showDarkerOverlayAtom,
  sidebarOpenAtom,
} from "./atoms/atoms";
import DarkerOverlay from "./components/DarkOverlay";
import LoadingOverlay from "./components/LoadingOverlay";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FormPage from "./pages/form";
import ResultPage from "./pages/result";

function App() {
  const { isLoading, message } = useAtomValue(loadingStateAtom);
  const [showDarkerOverlay, setShowDarkerOverlay] = useAtom(
    showDarkerOverlayAtom,
  );
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <FormPage />,
    },
    {
      path: "/r/:id",
      element: <ResultPage />,
    },
  ].map((route) => {
    return {
      ...route,
      element: (
        <div className="relative h-full">
          <LoadingOverlay isLoading={isLoading} message={message} />

          <Navbar />

          <DarkerOverlay show={showDarkerOverlay} />

          <Sidebar
            show={sidebarOpen}
            onClose={() => {
              setSidebarOpen(false);
              setShowDarkerOverlay(false);
            }}
          />

          <div className="mt-[50px] mx-auto w-[60%] p-5 min-w-[350px]">
            {route.element}
          </div>
        </div>
      ),
    };
  }));

  return <RouterProvider router={router} />;
}

export default App;
