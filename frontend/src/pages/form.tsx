import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GenerateScenarioRequest } from "../apis/generate";

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
];

function Form() {
  const { register, handleSubmit } = useForm<
    GenerateScenarioRequest
  >();
  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        try {
          navigate("/result", {
            state: { generateRequest: data },
          });
        } catch (e) {
          console.error(e);
        }
      })}
      className="flex flex-col items-center"
    >
      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          組織名
          <input
            className="w-[100%] rounded-lg"
            {...register("organizationName")}
          />
        </label>
      </div>

      <div className="w-4/5 my-2">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          事業内容
          <input
            className="w-[100%] rounded-lg"
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
