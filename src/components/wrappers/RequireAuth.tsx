import { useAuth } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const { userId } = useAuth();

    if(userId === undefined) return <div>Loading...</div>;
    if(userId === null) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default RequireAuth;