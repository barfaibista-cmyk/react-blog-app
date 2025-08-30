import axios from "axios";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.defaults.withCredentials = true;
    }, []);

    const fetchRolePermissions = useCallback(async () => {
        if (!currentUser || !currentUser.username) {
            setPermissions([]);
            return;
        }
		try {
			const resp = await axios.get('/api/rolepermissions');
			setPermissions(resp.data[currentUser.username] || []); 
		} catch(err) {
			console.error("Error fetching role permissions:", err);
			setPermissions([]);
		}
	},[currentUser]);

    const doLogin = async (loginIdentifier, password, isRemember) => {
        setLoading(true);
		try {
            const payload = {};
            if (loginIdentifier.includes('@')) {
                payload.email = loginIdentifier;
            } else {
                payload.username = loginIdentifier;
            }
            payload.password = password;
            payload.isRemember = isRemember;

			const res = await axios.post("/api/auth/login", payload);
			setCurrentUser(res.data);
        } catch(err) {
            console.error("Login failed:", err.response?.data || err.message);
            throw new Error(err.response?.data || "Login failed due to an unknown error.");
		} finally {
            setLoading(false);
        }
	};

    const doLogout = async () => {
        setLoading(true);
		try {
			await axios.post("/api/auth/logout");
			setCurrentUser(null);
			setPermissions([]);
			localStorage.removeItem("user");
		} catch(err) {
            console.error("Logout failed:", err);
		} finally {
            setLoading(false);
        }
	};

    useEffect(() => {
		if (currentUser) {
			localStorage.setItem("user", JSON.stringify(currentUser));
			fetchRolePermissions();
		} else {
            localStorage.removeItem("user");
            setPermissions([]);
        }
	}, [currentUser, fetchRolePermissions]);

    const hasPermission = useCallback((permission) => {
		return currentUser?.username && permissions.includes(permission);
	}, [currentUser, permissions]);

	return (
		<AuthContext.Provider value={{ currentUser, doLogin, doLogout, permissions, hasPermission, loading }}>
			{children}
		</AuthContext.Provider>
	);
};
