import {useUser} from "../components/UserContext/UserProvider";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = ({adminOnly = false}) => {
    const {me, loading} = useUser();
    if (loading) return <div>Loading...</div>;
    if (!me) return <Navigate to={'/'} replace/>;
    if (adminOnly && me.role !== 'admin') return <Navigate to={'/orders'} replace/>

    return <Outlet/>
};

export default ProtectedRoute;