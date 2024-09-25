import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GenerateResult } from "../types/result";
import { encodePlantUML64 } from "../utils/plantuml-text-encoder";

function Result() {
  const { id } = useParams<{ id?: string }>();
  const [generateResult, setGenerateResult] = useState<
    GenerateResult | undefined
  >();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<
    string | undefined
  >();
  const plantUML64 = useMemo(() => {
    if (!generateResult?.scenario.networkFigure) {
      return;
    }
    return encodePlantUML64(generateResult?.scenario.networkFigure);
  }, [generateResult?.scenario.networkFigure]);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    try {
      const generateResult = localStorage.getItem(id);
      if (!generateResult) {
        return;
      }
      console.log(JSON.parse(generateResult))
      setGenerateResult(JSON.parse(generateResult));
    } catch (e) {
      console.error(e);
      setErrorMessage(e as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!generateResult) {
    return <div />; // / に遷移しているはず
  }

  return (
    <div className="flex flex-col mx-auto">
      {errorMessage && (
        <div>
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">エラー</span>{" "}
              {errorMessage}
            </div>
          </div>
        </div>
      )}

      <h1 className="h3">{generateResult.scenario.title}</h1>

      <div className="pt-4">
        <h2>背景</h2>
        <p className="mt-4">{generateResult.scenario.background}</p>
      </div>

      <div className="pt-4">
        <h2 className="my-2">ネットワーク図</h2>
        <img
          src={`http://www.plantuml.com/plantuml/svg/${plantUML64}`}
          className="w-1/2 mx-auto min-w-[260px]"
        />
      </div>

      <div className="pt-4 w-[100%]">
        <h2 className="my-2">シチュエーション</h2>
        <ol className="relative border-l ml-4 -z-10">
          {generateResult.scenario.situation.map((situation, i) => {
            return (
              <li key={i} className="ml-4 mb-10">
                <div className="absolute w-3 h-3 bg-blue-200 rounded-full mt-2 -left-1.5 border border-white" />

                <div>
                  <h3 className="">{situation.date}</h3>
                  <p className="p-1">{situation.content}</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 text-green-600 p-4">
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p className="font-bold ml-1">ポイント</p>
                  </div>

                  <p className="">{situation.issue}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="pt-4">
        <h2>模範解答</h2>
        <p className="mt-4">{generateResult.scenario.modelAnswer}</p>
      </div>
    </div>
  );
}

export default Result;
