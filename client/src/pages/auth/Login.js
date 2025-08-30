import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './../../contexts/AuthContext';

const Login = () => {
    const { doLogin, loading } = useAuth();
    const [password, setPassword] = useState('');
    const [isRemember, setIsRemember] = useState(false);
	const [loginIdentifier, setLoginIdentifier] = useState('');
    const [error, setError] = useState(null);
	const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)
		if (!loginIdentifier.trim() || !password.trim()) {
            setError("Username/Email and password are required.");
            return;
        }

        try {
            await doLogin(loginIdentifier, password, isRemember);
            navigate('/dashboard');
        } catch (err) {
			setError(err.response?.data || err.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="login-box">
            <div className="login-logo">
                <Link to="/"><b>Admin</b>LTE</Link>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email or Username"
                                name={loginIdentifier}
                                value={loginIdentifier}
                                onChange={(e) => setLoginIdentifier(e.target.value)}
                            />
                            <div className="input-group-text">
                                <span className="bi bi-person"></span>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Your Password"
                                name="password"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                            />
                            <div className="input-group-text">
                                <span className="bi bi-lock-fill"></span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="remember"
                                    onChange={(e)=> setIsRemember(e.target.checked)}
                                    checked={isRemember}
                                    id="flexCheckDefault"
                                /> Remember Me </label>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <button type="submit" className="btn btn-block btn-primary w-100 my-3" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                        </div>
                    </form>
                    <p className="text-center mt-2">
                        <Link to="/auth/forget-password">I forgot my password</Link>
                    </p>
                    <p className="text-center">
                        <Link to="/auth/register" className="text-center"> Register a new membership </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;
