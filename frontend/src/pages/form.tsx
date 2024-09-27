import { isAxiosError } from "axios";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  generateScenario,
  GenerateScenarioRequest,
} from "../apis/generate";
import { loadingStateAtom } from "../atoms/atoms";
import { GenerateResult } from "../types/result";

// https://www.ipa.go.jp/security/10threats/10threats2023.html
const attackOriginOptions = [
  "ランサムウェアによる被害",
  "サプライチェーンの弱点を悪用した攻撃",
  "標的型攻撃による機密情報の窃取",
  "内部不正による情報漏えい",
  "テレワーク等のニューノーマルな働き方を狙った攻撃",
  "修正プログラムの公開前を狙う攻撃（ゼロデイ攻撃）",
  "ビジネスメール詐欺による金銭被害",
  "脆弱性対策の公開に伴う悪用増加",
  "不注意による情報漏えい等の被害",
  "ランダム",
];

const corporateScale = [
  "大",
  "中",
  "小"
]

function Form() {
  const { register, handleSubmit } = useForm<
    GenerateScenarioRequest
  >();
  const navigate = useNavigate();
  const setLoadingState = useSetAtom(loadingStateAtom);
  const [errorMessage, setErrorMessage] = useState<
    string | undefined
  >();
  const [generatedID, setGeneratedID] = useState<
    string | undefined
  >();
  useEffect(() => {
    if (generatedID) {
      navigate(`/r/${generatedID}`);
    }
  }, [generatedID]);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        setLoadingState({ isLoading: true, message: "生成中..." });
        try {
          if (data.attackOrigin == "ランダム"){
            data.attackOrigin = attackOriginOptions.slice(0,attackOriginOptions.length-1)[Math.floor(Math.random() * attackOriginOptions.length-1)]
          }
          const resp = await generateScenario(data);
          const id = uuidv4();
          const result: GenerateResult = {
            date: new Date().toJSON(),
            scenario: resp,
          };
          localStorage.setItem(id, JSON.stringify(result));
          setGeneratedID(id);
        } catch (e) {
          console.error(e);
          if (isAxiosError(e)) {
            setErrorMessage(e.message);
          }
        } finally {
          setLoadingState({ isLoading: false });
        }
      })}
      className="flex flex-col items-center"
    >
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

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          組織名
          <input
            className="w-[100%] rounded-lg"
            type="text"
            required
            {...register("organizationName")}
          />
        </label>
      </div>

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          事業内容
          <input
            className="w-[100%] rounded-lg"
            type="text"
            required
            {...register("businessContent")}
          />
        </label>
      </div>

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          起点
          <select
            className="rounded-lg w-[100%]"
            {...register("attackOrigin")}
          >
            {attackOriginOptions.map((opt) => (
              <option value={opt} key={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          オプション(任意)
          <textarea
            className="w-[100%] rounded-lg"
            rows={3}
            {...register("option")}
          />
        </label>
      </div>

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          インシデントレベル
          <input
            className="w-[100%] rounded-lg"
            type="text"
            required
            {...register("cyberAttackDifficultyLevel")}
          />
        </label>
      </div>

      <div className="w-4/5 my-2 flex">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          <input
            type="checkbox"
            className="rounded-sm mr-2"
            {...register("groupCompanyExists")}
          />
          グループ企業の有無
        </label>
      </div>

      <div className="w-4/5 my-2 flex">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          <input
            type="checkbox"
            className="rounded-sm mr-2"
            {...register("informationAssets")}
          />
          顧客情報の有無
        </label>
      </div>

      <div className="w-4/5 my-2 flex">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          <input
            type="checkbox"
            className="rounded-sm mr-2"
            {...register("socExists")}
          />
          SOC の有無 / 検知を自社で行う
        </label>
      </div>

      <div className="w-4/5 my-2 flex items-center">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          <input
            type="checkbox"
            className="rounded-sm mr-2"
            {...register("csirtExists")}
          />
          CSIRT の有無 / 対象を自社で行う
        </label>
      </div>

      <div className="w-4/5 my-2 flex items-center">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          <input
            type="checkbox"
            className="rounded-sm mr-2"
            {...register("incidentInvestigationExists")}
          />
          インシデント調査 の有無 / 調査を自社で行う
        </label>
      </div>

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          企業規模
          <select
            className="rounded-lg w-[100%]"
            {...register("corporateScale")}
          >
            {corporateScale.map((opt) => (
              <option value={opt} key={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>

      {/* TODO: この className どうにかしたい */}
      <button
        type="submit"
        className={`text-white bg-blue-500 hover:bg-blue-600 
          focus:ring-4 focus:ring-blue-300 font-medium
          rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
          focus:outline-none mt-5 w-32`}
      >
        Generate
      </button>
    </form>
  );
}

export default Form;
