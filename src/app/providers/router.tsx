import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
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
      { path: 'profile', element: <Profile /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
])
