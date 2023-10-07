import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validate } from "uuid";
import { GenerateResult } from "../types/result";

interface SidebarItemProps {
  date: string;
  list: ScenarioRow[];
}

interface ScenarioRow {
  title: string;
  id: string;
}

function Sidebar(props: {
  show: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<SidebarItemProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const map = new Map<string, ScenarioRow[]>();
    for (const key in localStorage) {
      if (!validate(key)) {
        continue;
      }
      const resJson = localStorage.getItem(key);
      if (!resJson) {
        continue;
      }
      let res: GenerateResult;
      try {
        res = JSON.parse(resJson);
      } catch (e) {
        continue;
      }
      const date = new Date(res.date);
      const ymd = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      const list = map.get(ymd) ?? [];
      map.set(
        ymd,
        [...list, {
          title: res.scenario.title,
          id: key,
        }],
      );
    }
    const list: SidebarItemProps[] = [];
    for (const [key, entry] of map) {
      list.push({
        date: key,
        list: entry,
      });
    }
    list.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date === b.date) {
        return 0;
      } else {
        return 1;
      }
    });
    setItems([...list]);
  }, []);

  if (!props.show) {
    return <div />;
  }
  return (
    <div className="h-[100%] bg-blue-500 absolute w-[15%] flex flex-col items-start min-w-[300px]">
      <button
        className="my-4 mx-4 py-2 px-2 text-white border text-sm flex  rounded-lg"
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

      {items.map((item) => {
        return (
          <div className="w-full">
            <p className="text-sm text-gray-200 ml-6 mb-2">
              {item.date}
            </p>
            {item.list.map((prop) => (
              <div className="ml-8 mt-2">
                <Link
                  key={prop.id}
                  to={`/r/${prop.id}`}
                  className="text-white text-lg"
                  onClick={() => props.onClose()}
                >
                  {prop.title}
                </Link>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
