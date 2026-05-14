import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@layout/Layout';
import { ListPage } from './pages/ListPage';
import { Post } from './pages/Post';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <ListPage /> },
      { path: 'post', element: <Post /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
export default App;