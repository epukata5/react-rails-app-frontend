import { useEffect, useState } from "react";
import { RecruitCard } from "../common/RecruitCard";
import { getRecruitments } from "@/api/recruitment";
import type { JobCategoryKey } from "@/types/app";
import { Pagination } from "../common/Pagenation";

// 求人データの型定義
interface Recruitment {
  id: number;
  title: string;
  salary: number;
  category: JobCategoryKey;
}

const ITEMS_PER_PAGE = 10; // 1ページあたりのアイテム数

export const RecruitmentList =  ({
  searchParams = {}
}: {
  searchParams: { category?: string | string[], page?: string, min_salary?: string }
}) => {

  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // データの取得とエラーハンドリングを行うuseEffect
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // APIからデータを取得
        const data = await getRecruitments();
        setRecruitments(data);
      } catch (err) {
        console.error(err);
        setError("データの読み込みに失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // パラメータの取得
  const categoryParam = searchParams.category;
  const categories = categoryParam 
    ? (Array.isArray(categoryParam) ? categoryParam : [categoryParam])
    : [];
  const currentPage = Number(searchParams.page) || 1;
  const minSalary = Number(searchParams.min_salary) || 0;

  // ローディング中はローディングメッセージを表示
  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">読み込み中...</div>;
  }

  // エラーがある場合はエラーメッセージだけを返す
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  //フィルタリング
  const filteredRecruits = recruitments.filter((recruit) => {
    // カテゴリーが指定されている場合、含まれていなければ除外
    if (categories.length > 0 && !categories.includes(recruit.category)) {
      return false;
    }
    // 最低年収が指定されている場合、下回っていれば除外
    if (minSalary > 0 && recruit.salary < minSalary) {
      return false;
    }
    return true;
  });

  // 3. ページネーション用の計算
  const count = filteredRecruits.length; // 絞り込み後の総件数
  const totalPages = Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  // 現在のページに表示する分だけ配列を切り出す
  const paginatedRecruits = filteredRecruits.slice(from, from + ITEMS_PER_PAGE);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold">求人一覧</h2>
      <p className="mb-4 text-sm">該当件数: {count}件</p>

      {/* 0件の場合はメッセージを、ある場合はカードのリストを表示 */}
      {paginatedRecruits.length === 0 ? (
        <div className="text-center py-10 text-gray-500">求人情報が見つかりませんでした。</div>
      ) : (
        <div className="space-y-4">
          {paginatedRecruits.map((recruit) => (
            <RecruitCard
              key={recruit.id}
              title={recruit.title}
              category={recruit.category}
              salary={recruit.salary}
            />
          ))}
        </div>
      )}

      {/* 検索結果がある場合のみページネーションを表示 */}
      {count > 0 && (
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
}

