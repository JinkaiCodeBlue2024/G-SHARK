import { Mode } from "react-hook-form";
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
  incidentInvestigationExists: boolean;
}

export interface GenerateScenarioResponse {
  title: string;
  background: string;
  networkFigure: string; // this format is PlantUML
  situation: Situation[];
  modelAnswer: ModelAnswer[];
}

export interface Situation {
  situationNo: number;
  date: string;
  content: string;
  issue: string;
}

export interface ModelAnswer {
  situationNo: number;
  date: string;
  content: string;
  answer: string;
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
