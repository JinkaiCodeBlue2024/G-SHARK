import { http } from "./common";

export interface GenerateScenarioRequest {
  scenario: string;
  startingPoint: string;
  targetCompanyName: string;
  companyScale: string;
  option?: string;
}

export interface GenerateScenarioResponse {
  scenario: string;
  background: string;
  networkFigure: string; // this format is PlantUML
  attackerObjective: string;
  attackerProcedure: string;
  exercisePurpose: string;
}

export function generateScenario(
  req: GenerateScenarioRequest,
): Promise<GenerateScenarioResponse> {
  return http.post("/generate-scenario", req);
}
