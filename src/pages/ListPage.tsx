import { useSearchParams } from "react-router-dom";
import { RecruitmentList } from "@layout/RecruitmentList";
import { Sidebar } from "@layout/Sidebar";

export const ListPage = () => {

  const [searchParams] = useSearchParams();
  const categories = searchParams.getAll('category');
  const params = {
    category: categories.length > 0 ? categories : undefined,
    page: searchParams.get('page') || undefined,
    min_salary: searchParams.get('min_salary') || undefined,
  };

  return (
    <section className="flex">
      <div className="w-50 bg-gray-200">
        <Sidebar />
      </div>
      <div className="flex-1">
        <RecruitmentList searchParams={params}/>
      </div>
    </section>
  );
}