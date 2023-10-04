import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GenerateScenarioResponse } from "../apis/generate";
import { encodePlantUML64 } from "../utils/plantuml-text-encoder";

function Result() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [generateResponse, setGenerateResponse] = useState<
    GenerateScenarioResponse | undefined
  >();
  const [errorMessage, setErrorMessage] = useState<
    string | undefined
  >();
  const plantUML64 = useMemo(() => {
    if (!generateResponse?.networkFigure) {
      return;
    }
    return encodePlantUML64(generateResponse?.networkFigure);
  }, [generateResponse?.networkFigure]);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    const res = localStorage.getItem(id);
    if (!res) {
      navigate("/");
      return;
    }
    try {
      const resp = JSON.parse(res) as GenerateScenarioResponse;
      setGenerateResponse(resp);
    } catch (e) {
      console.error(e);
      setErrorMessage("不正なIDです");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!generateResponse) {
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

      <h1 className="h3">{generateResponse.title}</h1>

      <div className="pt-4">
        <h2>背景</h2>
        <p>{generateResponse.background}</p>
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
        {generateResponse.situation.map((situation, i) => {
          return (
            <div key={i} className="my-4">
              <div>
                <h3>{situation.date}</h3>
                <p className="p-1">{situation.content}</p>
              </div>

              <div
                className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50"
                role="alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mx-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="sr-only">Suggest</span>
                <p>{situation.issue}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Result;
