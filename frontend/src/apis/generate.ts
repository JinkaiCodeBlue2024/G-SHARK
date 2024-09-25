import { http } from "./common";

export interface GenerateScenarioRequest {
  organizationName: string;
  groupCompanyExists: boolean;
  businessContent: string;
  informationAssets: boolean;
  socExists: boolean;
  csirtExists: boolean;
  attackOrigin: string;
  option: string;
  cyberAttackDifficultyLevel: string;
}

export interface GenerateScenarioResponse {
  title: string;
  background: string;
  networkFigure: string; // this format is PlantUML
  situation: Situation[];
  modelAnswer: string;
}

export interface Situation {
  situationNo: number;
  date: string;
  content: string;
  issue: string;
}

export async function generateScenario(
  req: GenerateScenarioRequest,
): Promise<GenerateScenarioResponse> {
  const resp = await http.post("/generate_scenario", req);
  return resp.data;
}

export async function getSample(): Promise<GenerateScenarioResponse> {
  const resp = await http.get("/sample");
  return resp.data;
}
