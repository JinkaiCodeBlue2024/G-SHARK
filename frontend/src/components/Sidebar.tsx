import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validate } from "uuid";
import { GenerateScenarioResponse } from "../apis/generate";

interface SidebarItemProps {
  title: string;
  id: string;
}

function Sidebar(props: {
  show: boolean;
  onClose: () => void;
}) {
  const [resList, setResList] = useState<SidebarItemProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const list: SidebarItemProps[] = [];
    for (const key in localStorage) {
      if (!validate(key)) {
        continue;
      }
      const resJson = localStorage.getItem(key);
      if (!resJson) {
        continue;
      }
      let res: GenerateScenarioResponse;
      try {
        res = JSON.parse(resJson);
      } catch (e) {
        continue;
      }
      list.push({
        title: res.title,
        id: key,
      });
    }
    console.log(list);
    setResList([...list]);
  }, []);

  if (!props.show) {
    return <div />;
  }
  return (
    <div className="h-[100%] bg-blue-500 absolute w-[15%] flex flex-col items-start">
      <button
        className="my-2 mx-4 py-2 px-2 text-white border text-sm flex  rounded-lg"
        onClick={() => {
          props.onClose();
          navigate("/");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />
        </svg>

        <p className="my-auto mx-2">Generate</p>
      </button>

      {resList.map((item) => {
        console.log(item);
        return (
          <Link
            key={item.id}
            to={`/r/${item.id}`}
            className="text-white text-sm my-2 mx-4"
            onClick={() => props.onClose()}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;
