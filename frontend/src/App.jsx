import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout"
import Landing from "./components/Landing"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Home from "./components/Home"
import PanelLayout from "./components/panel/PanelLayout"
import ProductList from "./components/ProductList"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserList from "./components/panel/UserList"
import OrderList from "./components/panel/OrderList"
import ProtectedRoute from './auth/ProtectedRoute'
import AddProduct from "./components/panel/AddProduct"
import Chat from "./components/panel/Chat"
import BuyPopup from './components/BuyPopup'
import Checkout from "./components/CheckOut"
import CheckoutScreen from "./components/CheckoutScreen"
import CheckOut from "./components/CheckOut"
import CheckoutAddress from "./components/CheckoutAddress"


const App = () => {


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Landing />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "signup",
          element: <SignUp />
        },
        {
          path: "home",
          element: <Home />
        },
        {
          path: "update",
          element: <SignUp />
        },
        {
          path: 'admin',
          element: <ProtectedRoute adminOnly={true} />,
          children: [
            {
              element: <PanelLayout />,
              children: [
                { path: '', element: <UserList /> },
                { path: 'products', element: <ProductList /> },
                { path: 'orders', element: <OrderList /> },
                { path: 'add-product', element: <AddProduct />},
                { path: 'chat-room', element: <Chat />}
              ]
            }
          ]
        },
        {
          path: 'profile',
          element: <ProtectedRoute />,
          children: [
            {
              element: <PanelLayout />,
              children: [
                { path: '', element: <ProductList /> },
                { path: 'orders', element: <OrderList /> },
                { path: 'chat-room', element: <Chat />},
                { path: 'buy', element: <BuyPopup />},
                { path: 'checkout-address', element: <CheckoutAddress />}
              ]
            }
          ]
        },
        {
          path: 'payment',
          element: <CheckOut />
        }
      ]
    }
  ])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark" // Matches your CryptoFlow theme
      />
      <RouterProvider router={router} />
    </>
  )
}

export default App