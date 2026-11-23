import {createBrowserRouter, Navigate} from "react-router-dom"
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ActivatePage from "./pages/ActivatePage";

const router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {index: true, element: <Navigate to={'login'}/>},
            {path: 'login', element: <LoginPage/>},
            {path: 'activate/:token', element: <ActivatePage/>},
            {
                element: <ProtectedRoute/>, children: [
                    {path: 'orders', element: <OrdersPage/>}
                ]
            },
            {
                element: <ProtectedRoute adminOnly/>, children: [
                    {path: 'adminPanel', element: <AdminPage/>}
                ]
            }
        ]
    }
])

export {
    router
}