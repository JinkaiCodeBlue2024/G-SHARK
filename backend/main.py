from typing import Optional, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import create_scenario
import json

print("hoge")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",  # local
        "https://jinkai-libra-2023.web.app", # production
    ],
    # allow_origins = [
    #     "*"
    # ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class GenerateScenarioRequest(BaseModel):
    organizationName: str
    groupCompanyExists: bool
    businessContent: str
    informationAssets: bool
    socExists: bool
    csirtExists: bool
    attackOrigin: str
    option: Optional[str] = None
    cyberAttackDifficultyLevel: str


class Situation(BaseModel):
    situationNo: int
    date: str
    content: str
    issue: str


class GenerateScenarioResponse(BaseModel):
    title: str
    background: str
    networkFigure: str
    situation: List[Situation]
    modelAnswer: str


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/sample", response_model=GenerateScenarioResponse)
def sample():
    # sample
    gpt_response = {
        "title": "ABC株式会社に対する標的型攻撃シナリオ",
        "background": "ABC株式会社はソフトウェア開発を行いながら情報資産の保護に努めている企業です。社内にはSOCとCSIRTを設備していますが、今回は実際の攻撃事例に基づいた標的型攻撃による機密情報の窃取をテーマに、彼らのセキュリティ対策の強化と具体化を目指します。",
        "networkFigure": '@startuml\ntitle ABC Company Network Architecture\n\ncloud "Internet" as internet\ndatabase "Server" as server\nnode "SOC" as soc\nnode "CSIRT" as csirt\nactor "Attacker (IP:10.0.0.1)" as attacker\n\ninternet --down--> attacker : Attempted breach \\n (Situation 1 & 3)\nattacker --right--> server : Malware Attack \\n (Trojan Horse)\nserver -up-> csirt : Report detected breach \\n (Situation 2 & 4)\ncsirt --left--> soc : Communicate breach \\n details to SOC\n\n@enduml',
        "situation": [
            {
                "situationNo": 1,
                "date": "2023-01-01",
                "content": "攻撃者がABC株式会社のサーバ（IP：192.168.0.1）に侵入を試みたものの、セキュリティの対策により未遂に終わりました。",
                "issue": "侵入を試みた攻撃手法とそれを防止した対策の詳細",
            },
            {
                "situationNo": 2,
                "date": "2023-01-02",
                "content": "JPSIRTからの報告により、侵入を試みた攻撃者のIPアドレス（IP：10.0.0.1）と使用したマルウェア（Trojan Horse）が特定されました。",
                "issue": "JPSIRTからの報告に基づく侵入者とマルウェアの同定",
            },
            {
                "situationNo": 3,
                "date": "2023-01-03",
                "content": "攻撃者が再度ABC株式会社のサーバ（IP：192.168.0.1）に対して異なる方法で攻撃を試みましたが、同じく未遂に止まりました。",
                "issue": "再度の攻撃に対する対策と検出",
            },
            {
                "situationNo": 4,
                "date": "2023-01-04",
                "content": "侵入を試みた攻撃者の詳細な特定と、逮捕に繋がる情報を収集しました。また、攻撃に用いられた端末とその数（5台）も同定しました。",
                "issue": "攻撃者と端末の特定、及びその後の対策",
            },
        ],
    }
    sample_response = GenerateScenarioResponse(**gpt_response)
    return sample_response


@app.post("/generate_scenario", response_model=GenerateScenarioResponse)
def generate_scenario(scenario_request: GenerateScenarioRequest):
    scenario_response = create_scenario.create_scenario(
        scenario_request.model_dump_json()
    )
    return scenario_response
