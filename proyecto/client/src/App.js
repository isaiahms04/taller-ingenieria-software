import logo from './logo.svg';
import './App.css';
import {BrowserRouter, createBrowserRouter, Outlet, Route, RouterProvider, Routes} from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Update from './pages/update/Update.jsx';
import Add from './pages/add/Add.jsx';
import NavBar from './pages/navBar/NavBar.jsx';
import './style.scss';

function App() {

  const Layout = () => {
    return (
      <div>
        <NavBar/>
        <Outlet/>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path:"/",
      element: (
          <Layout/>
      ),
      children: [
        {
          path:"/",
          element: <Home/>,
        },
        {
          path:"/add",
          element: <Add/>,
        },
        {
          path:"/update/:id",
          element: <Update/>,
        },
      ],
    },
  ]);

  return (
    <div className="App">

      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
