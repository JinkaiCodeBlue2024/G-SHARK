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
      <table className="w-[100%] border-spacing-2">
        <tbody>
          <InputRow
            labelName="組織名"
            element={
              <input
                className="w-[100%] rounded-lg"
                {...register("organizationName")}
              />
            }
          />
          <InputRow
            labelName="事業内容"
            element={
              <input
                className="w-[100%] rounded-lg"
                {...register("businessContent")}
              />
            }
          />
          <InputRow
            labelName="起点"
            element={
              <select
                className="rounded-lg w-[100%]"
                {...register("attackOrigin")}
              >
                {attackOriginOptions.map((opt) => (
                  <option value={opt} key={opt}>{opt}</option>
                ))}
              </select>
            }
          />
          <InputRow
            labelName="グループ企業の有無"
            element={
              <input
                type="checkbox"
                className="rounded-sm"
                {...register("groupCompanyExists")}
              />
            }
          />
          <InputRow
            labelName="顧客情報の有無"
            element={
              <input
                type="checkbox"
                className="rounded-sm"
                {...register("informationAssets")}
              />
            }
          />
          <InputRow
            labelName="SOC の有無 / 検知を自社で行う"
            element={
              <input
                type="checkbox"
                className="rounded-sm"
                {...register("socExists")}
              />
            }
          />
          <InputRow
            labelName="CSIRT の有無 / 対象を自社で行う"
            element={
              <input
                type="checkbox"
                className="rounded-sm"
                {...register("csirtExists")}
              />
            }
          />
        </tbody>
      </table>

      {/* TODO: この className どうにかしたい */}
      <button
        type="submit"
        className={`text-white bg-gray-700 hover:bg-gray-800 
          focus:ring-4 focus:ring-gray-300 font-medium
          rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
          dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none
          dark:focus:ring-gray-800
          mt-5 w-32`}
      >
        Generate
      </button>
    </form>
  );
}

function InputRow(props: {
  labelName: string;
  element: JSX.Element;
}) {
  return (
    <tr>
      <td className="pt-4 px-2" valign="top">
        <p className="bg-gray-300 text-center w-56">
          {props.labelName}
        </p>
      </td>
      <td className="pt-4 text-center w-[100%]" valign="middle">
        {props.element}
      </td>
    </tr>
  );
}

export default Form;
