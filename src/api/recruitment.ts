import { type JobCategoryKey } from "@/types/app";
import type { RecruitmentFormData } from "@/types/app";

const url = import.meta.env.VITE_API_URL;
interface Recruitment {
  id: number;
  title: string;
  salary: number;
  category: JobCategoryKey;
}

// APIから求人データを取得する関数
export const getRecruitments = async (): Promise<Recruitment[]> => {
  const response = await fetch(`${url}/recruitments`);

  // Rails側でエラー（500エラーなど）が起きた場合のハンドリング
  if (!response.ok) {
    throw new Error(`求人データの取得に失敗しました: ${response.statusText}`);
  }

  // JSONデータをJavaScriptのオブジェクト（配列）に変換して返す
  const data: Recruitment[] = await response.json();
  return data;
};

// APIに求人データを送信する関数
export const submitRecruitment = async (formData: RecruitmentFormData) => {

  try {
    const response = await fetch(`${url}/recruitments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recruitment: formData }),
    });

    // エラー時のハンドリング
    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return { success: false, ...errorData }; // Rails側のバリデーションエラー等を返す
      } else {
        // 500エラーや、Nginx等のゲートウェイエラーの場合
        return { success: false, message: "サーバーで予期せぬエラーが発生しました。" };
      }
    }

    return { success: true };

  } catch (error) {
    console.error("通信エラー:", error);
    return { success: false, message: "サーバーとの通信に失敗しました。ネットワークを確認してください。"};
    
  }

}