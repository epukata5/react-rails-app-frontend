import { getJobCategoryName, type JobCategoryKey } from "@/types/app"

type RecruitCardProps = {
  title: string,
  category: JobCategoryKey,
  salary: number,
};

export const RecruitCard = (props: RecruitCardProps) => {
  return (
    <div className="border rounded pt-2 pl-4 h-36 border-slate-300">
      <h3 className="text-lg font-bold mb-1">{props.title}</h3>
      <p className="mb-1">カテゴリ: {getJobCategoryName(props.category)}</p>
      <p>年収: {props.salary}万円</p>
    </div>
  );
}