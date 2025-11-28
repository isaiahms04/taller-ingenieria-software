import './App.css';
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Update from './pages/update/Update.jsx';
import Add from './pages/add/Add.jsx';
import NavBar from './pages/navBar/NavBar.jsx';
import Inscripciones from './pages/inscripciones/Inscripciones.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
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

  // 🔒 Layout protegido por token
  const ProtectedLayout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return <Layout />;
  };

  // 🔒 Ruta Home que solo muestra la lista de eventos a admin
  const HomeRoute = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // si es usuario normal, lo mandamos a inscripciones
    if (user && user.role === 'user') {
      return <Navigate to="/inscripciones" replace />;
    }

    // admin ve el Home normal
    return <Home />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        { path: "", element: <HomeRoute /> },                  // /
        { path: "add", element: <Add /> },                     // /add
        { path: "update/:id", element: <Update /> },           // /update/:id
        { path: "inscripciones", element: <Inscripciones /> }, // /inscripciones
      ],
    },

    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
