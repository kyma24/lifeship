import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const RedirectOnAuth = () => {
    const { userId } = useAuth();

    if(userId === undefined) return <div>Loading...</div>;
    if(userId) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default RedirectOnAuth;