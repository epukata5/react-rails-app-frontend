import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col max-w-200 w-full mx-auto">
      <Header />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};