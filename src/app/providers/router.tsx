import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import RequireAuth from './RequireAuth'
import Home from '../../pages/Home'
import Login from '../../pages/Login'
import Register from '../../pages/Register'
import Profile from '../../pages/Profile'
import Product from '../../pages/Product'
import Cart from '../../pages/Cart'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'product/:id', element: <Product /> },
      {
        element: <RequireAuth />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'cart', element: <Cart /> },
        ],
      },
    ],
  },
])
