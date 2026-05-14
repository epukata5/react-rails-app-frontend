import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitRecruitment } from "@/api/recruitment";
import  { type RecruitmentFormData, recruitmentSchema, JOB_CATEGORIES } from "@/types/app";

export const Post = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RecruitmentFormData>({
    resolver: zodResolver(recruitmentSchema),
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RecruitmentFormData) => {
    setIsSubmitting(true);
    const result = await submitRecruitment(data);

  if (result.success) {
  // 成功時の処理(トップページへ遷移)
  navigate("/");

} else {
  // 失敗時の処理
  if (result.errors) {
    // result.errors の中身（キー）をループして、動的に setError に割り当てる
    Object.keys(result.errors).forEach((key) => {
      // key が単なる string 型と判定されてしまうため、
      // フォームの型（RecruitmentFormData）のキーであることを明示
      const fieldName = key as keyof RecruitmentFormData;
      
      setError(fieldName, {
        type: "server", // サーバーからのエラーであることを明示
        message: result.errors[fieldName][0], // 配列の最初のメッセージを取り出す
      });
    });
  } else {
    // バリデーション以外のエラー（DB保存失敗、500エラーなど）
    alert(result.message || "予期せぬエラーが発生しました。");
  }
}
  };

  return (
    <section className="mx-10">
    <h2 className="text-xl font-bold py-4">求人投稿</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block mb-1 font-medium">求人カテゴリ選択</label>
        <select {...register("category")} className="border p-2 w-60 rounded appearance-none text-sm bg-none">
          <option value="">
            カテゴリを選択▼
          </option>
          {Object.entries(JOB_CATEGORIES).map(([cat, value]) => (
            <option key={cat} value={cat}>
              {value}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">年収 (万円)</label>
        <input
          type="number"
          {...register("salary", { valueAsNumber: true })}
          className="border p-2 w-60 rounded"
        />
        {errors.salary && (
          <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">求人タイトル</label>
        <input
          {...register("title")}
          className="border p-2 w-full rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-sky-600 text-white px-4 py-2 mt-4 rounded hover:bg-sky-700 disabled:opacity-50 w-60 text-sm font-medium transition-colors"
      >
        {isSubmitting ? "送信中..." : "投稿"}
      </button>
    </form>
    </section>
  );
}