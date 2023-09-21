import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GenerateScenarioResponse } from "../apis/generate";
import { encodePlantUML64 } from "../utils/plantuml-text-encoder";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [generateResponse, setGenerateResponse] = useState<
    GenerateScenarioResponse | undefined
  >();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }
    const { generateResponse } = location.state as {
      generateResponse: GenerateScenarioResponse | null;
    };
    if (!generateResponse) {
      navigate("/");
      return;
    }
    setGenerateResponse(generateResponse);
  }, [location, navigate]);

  if (!generateResponse) {
    return <div />; // / に遷移しているはず
  }

  const plantUML64 = encodePlantUML64(generateResponse.networkFigure);

  return (
    <div className="flex flex-col mt-[50px] mx-auto w-[60%] p-10 prose prose-sm">
      <h3 className="h3">シナリオ</h3>
      <p>{generateResponse.scenario}</p>
      <h3>背景</h3>
      <p>{generateResponse.background}</p>
      <h3>ネットワーク図</h3>
      <img
        src={`http://www.plantuml.com/plantuml/svg/${plantUML64}`}
      />
      <h3>攻撃者の目的</h3>
      <p>{generateResponse.attackerObjective}</p>
      <h3>攻撃手順</h3>
      <p>{generateResponse.attackerProcedure}</p>
      <h3>演習の目的</h3>
      <p>{generateResponse.exercisePurpose}</p>
    </div>
  );
}

export default Result;
