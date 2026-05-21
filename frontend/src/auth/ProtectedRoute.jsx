import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false }) => {
    const { isAuthenticated, currentUser, isLoading } = useSelector(state => state.user);
    const location = useLocation();

    // if (isLoading) return (<div>Loading...</div>);
    console.log("isloading", isLoading)
    if (!isAuthenticated) {
        // it will remember the path where user trying to go
        
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    console.log("isAuthenticated", isAuthenticated)

    if (adminOnly && currentUser?.role !== 'admin') {
       
        return <Navigate to="/home" replace />;
    }
     console.log("isAdmin", adminOnly)

    return <Outlet />;
};

export default ProtectedRoute