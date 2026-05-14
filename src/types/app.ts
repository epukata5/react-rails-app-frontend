import { z } from "zod";

export const JOB_CATEGORIES = {
  clerical: "事務",
  engineer: "エンジニア",
  sales: "営業",
  design: "デザイン",
  marketing: "マーケティング",
  finance: "財務・経理",
  hr: "人事",
  customer_support: "カスタマーサポート",
  manufacturing: "製造",
  medical_care: "医療・介護",
} as const;

// キー（英語）の型を抽出 ("clerical" | "engineer" | ...)
export type JobCategoryKey = keyof typeof JOB_CATEGORIES;

export const getJobCategoryName = (key: JobCategoryKey): string => {
  return JOB_CATEGORIES[key];
};

// 配列形式で取得するヘルパー（サイドバーのループ表示などで便利）
export const JOB_CATEGORY_OPTIONS = Object.entries(JOB_CATEGORIES).map(
  ([key, label]) => ({
    key: key as JobCategoryKey,
    label,
  })
);

export const recruitmentSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.enum(Object.keys(JOB_CATEGORIES) as [string, ...string[]]).describe("カテゴリーは必須です"),
  salary: z.number({
    message: "給与を正しい数値で入力してください", 
  }).min(1, "1以上の金額を入力してください"),
});

export type RecruitmentFormData = z.infer<typeof recruitmentSchema>;