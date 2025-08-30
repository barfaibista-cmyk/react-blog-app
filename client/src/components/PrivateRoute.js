import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './../contexts/AuthContext';
import Spinner from './Spinner';

const PrivateRoute = ({ allowedRoles = [] }) => {
	const { currentUser, loading } = useAuth();

	if (loading) return <Spinner />;

	if(!currentUser) return <Navigate to="/auth/login" replace />;

	// if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) return <Navigate to="/unauthorized" replace />;

    return <Outlet />;
}

export default PrivateRoute;
