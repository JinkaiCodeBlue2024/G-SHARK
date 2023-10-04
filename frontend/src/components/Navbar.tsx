import { useAtom, useSetAtom } from "jotai";
import Icon from "./../assets/icon.png";
import {
  showDarkerOverlayAtom,
  sidebarOpenAtom,
} from "../atoms/atoms";

const title = "G-SHARK";

function Navbar() {
  const [showDarkerOverlay, setShowDarkerOverlay] = useAtom(
    showDarkerOverlayAtom,
  );
  const setSidebarOpen = useSetAtom(sidebarOpenAtom);

  return (
    <nav className="flex bg-blue-500 p-2 border-b-[1px]">
      <div className="flex">
        <button
          onClick={() => {
            setSidebarOpen((o) => !o);
            setShowDarkerOverlay(!showDarkerOverlay);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 my-auto mx-2 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <img src={Icon} className="w-12 mx-2" />
        <span className="text-white text-xl my-auto">
          {title}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
