from typing import Optional, List

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()


class GenerateScenarioRequest(BaseModel):
    organizationName: str
    groupCompanyExists: bool
    businessContent: str
    infomationAssets: bool
    socExists: bool
    csirtExists: bool
    attackOrigin: str
    option: Optional[str] = None


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


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/generate-scenario")
def generate_scenario(scenario_request: GenerateScenarioRequest):
    # TODO: scenario_requestをOpenAIのAPIに接続するモジュールに渡してレスポンスを受け取る
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
    scenario_response = GenerateScenarioResponse(**gpt_response)
    return scenario_response
