import { http } from "./common";

export interface GenerateScenarioRequest {
  scenario: string;
  startingPoint: string;
  targetCompanyName: string;
  companyScale: string;
  option?: string;
}

export interface GenerateScenarioResponse {
  title: string;
  background: string;
  networkFigure: string; // this format is PlantUML
  situation: Situation[];
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
