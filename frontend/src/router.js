import {createBrowserRouter, Navigate} from "react-router-dom"
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {index: true, element: <Navigate to={'login'}/>},
            {path: 'login', element: <LoginPage/>},
            {path: 'orders', element: <OrdersPage/>}
        ]
    }
])

export {
    router
}