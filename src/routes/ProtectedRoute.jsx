import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredPermission }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const userPermissions = JSON.parse(localStorage.getItem("user_permissions")) || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      alert("Access Denied: you do not have permission to view this page. ");
      return <Navigate to="/dashboard" replace />; 
    }
  }

  return children;
}

export default ProtectedRoute;