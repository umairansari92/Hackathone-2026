import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but doesn't have the required role, send them to their dashboard
    switch (user.role) {
      case "Admin":
        return <Navigate to="/admin-dashboard" replace />;
      case "Doctor":
        return <Navigate to="/doctor-dashboard" replace />;
      case "Receptionist":
        return <Navigate to="/receptionist-dashboard" replace />;
      case "Patient":
      default:
        return <Navigate to="/patient-dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
