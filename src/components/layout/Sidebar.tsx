import { useSearchParams } from "react-router-dom";
import { JOB_CATEGORY_OPTIONS } from "@/types/app";


// 年収の選択肢を定義
const SALARY_OPTIONS = [
  { label: '指定なし ▼', value: '0' },
  { label: '300万円以上 ▼', value: '300' },
  { label: '400万円以上 ▼', value: '400' },
  { label: '500万円以上 ▼', value: '500' },
  { label: '600万円以上 ▼', value: '600' },
  { label: '800万円以上 ▼', value: '800' },
  { label: '1000万円以上 ▼', value: '1000' },
];

export const Sidebar = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  
  // 現在のURLから選択状態を取得
  const currentCategories = searchParams.getAll('category');
  const currentMinSalary = searchParams.get('min_salary') || '0';

  // カテゴリ（チェックボックス）が操作されたときの処理
  const handleCategoryChange = (categoryKey: string, isChecked: boolean) => {
    // 現在のパラメータをベースに新しいパラメータオブジェクトを作成
    const newParams = new URLSearchParams(searchParams);

    if (isChecked) {
      // チェックされたら追加
      newParams.append('category', categoryKey);
    } else {
      // チェックが外れたら削除
      // getAllで取得した配列から、外されたキーを除外して再設定する
      const updatedCategories = currentCategories.filter(c => c !== categoryKey);
      newParams.delete('category');
      updatedCategories.forEach(c => newParams.append('category', c));
    }

    // 絞り込み条件が変わったら、結果の件数が変わるので1ページ目に戻す
    newParams.set('page', '1');
    
    // URLを更新する
    setSearchParams(newParams);
  };

  // 年収（プルダウン）が操作されたときの処理
  const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    const newSalary = e.target.value;

    if (newSalary === '0') {
      newParams.delete('min_salary'); // 「指定なし」ならパラメータごと消す
    } else {
      newParams.set('min_salary', newSalary);
    }

    // 絞り込み条件が変わったら1ページ目に戻す
    newParams.set('page', '1');
    
    setSearchParams(newParams);
  };

  return(
    <nav className="p-3 bg-gray-200">
      <h3 className="text-lg font-bold mb-2 text-left">求人カテゴリ</h3>
      <ul className="mb-2">
        {JOB_CATEGORY_OPTIONS.map((option) => (
          <li key={option.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option.key}
                checked={currentCategories.includes(option.key)}
                onChange={(e) => handleCategoryChange(option.key, e.target.checked)}
                className="accent-sky-400 border-sky-400"
              />
              {option.label}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-bold my-2 text-left">年収</h3>
      <select 
        value={currentMinSalary}
        onChange={handleSalaryChange}
        className="border p-2 w-full rounded bg-white appearance-none bg-none"
       >
        {SALARY_OPTIONS.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </nav>
  );
}