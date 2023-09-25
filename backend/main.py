from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()


class GenerateScenarioRequest(BaseModel):
    scenario: str
    startingPoint: str
    targetCompanyName: str
    companyScale: str
    option: Optional[str] = None


class GenerateScenarioResponse(BaseModel):
    scenario: str
    background: str
    networkFigure: str  # this format is PlantUML
    attackerObjective: str
    attackerProcedure: str
    exercisePurpose: str


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/generate-scenario")
def generate_scenario(scenario_request: GenerateScenarioRequest):
    # TODO: scenario_requestをOpenAIのAPIに接続するモジュールに渡してレスポンスを受け取る
    # sample
    gpt_response = {
        "scenario": "VPN 機器からの侵入",
        "background": "企業AはクライアントPC10台を持つ中規模の企業で、顧客情報などの機密情報を保持しています。\n最近、企業AのVPN機器に対する不正なアクセスが検出され、認証情報の一部が窃取された可能性があることが判明しました。",
        "networkFigure": "@startuml\nnwdiag {\n  network dmz {\n      address = \"210.x.x.x/24\"\n\n      web01 [address = \"210.x.x.1\"];\n      web02 [address = \"210.x.x.2\"];\n  }\n}\n@enduml",
        "attackerObjective": "攻撃者はVPN機器への侵入に成功し、認証情報を窃取しました。...",
        "attackerProcedure": "攻撃者はVPN機器への侵入に成功し、認証情報を入手します。...",
        "exercisePurpose": "クライアントPCのセキュリティ意識向上と攻撃からの防御方法の確立。...",
    }
    scenario_response = GenerateScenarioResponse(**gpt_response)
    return scenario_response
