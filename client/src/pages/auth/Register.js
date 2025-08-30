import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
 		setError(null);

	    if (!email || !password || !confirmPassword) {
	        setError("All fields are required.");
	        return;
	    }
	    if (password !== confirmPassword) {
	        setError("Confrim password is not match.");
	        return;
	    }
	    if (password.length < 6) {
	        setError("Password should have at least 6 characters.");
	        return;
	    }

        setLoading(true);
        try {
            await axios.post('/api/auth/register', { email, password });
            setLoading(false);
            navigate('/auth/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="register-box">
            <div className="register-logo">
                <Link to="/"><b>Admin</b>LTE</Link>
            </div>
            <div className="card">
                <div className="card-body register-card-body">
                    <p className="register-box-msg">Sign up to start your session</p>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleRegister}>
				        <div className="input-group mb-3">
				            <input
				                id="email"
				            	className="form-control"
					            type="email"
					            placeholder="Email Address"
					            value={email}
					            onChange={(e) => setEmail(e.target.value)}
				            />
		                    <div className="input-group-text">
		                        <span className="bi bi-envelope"></span>
		                    </div>
				        </div>
				        <div className="input-group mb-3">
				            <input
				            	id="password"
				            	className="form-control"
					            type="password"
					            placeholder="Password"
					            value={password}
					            onChange={(e) => setPassword(e.target.value)}
				            />
		                    <div className="input-group-text">
		                        <span className="bi bi-lock-fill"></span>
		                    </div>
				        </div>
				        <div className="input-group mb-3">
				            <input
				            	id="password"
				            	className="form-control"
					            type="password"
					            placeholder="Confirm Password"
					            value={confirmPassword}
					            onChange={(e) => setConfirmPassword(e.target.value)}
				            />
		                    <div className="input-group-text">
		                        <span className="bi bi-lock-fill"></span>
		                    </div>
				        </div>
                        <div className="d-flex justify-content-center align-items-center">
		                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
		                        {loading ? 'Registering...' : 'Register'}
		                    </button>
                         </div>
                    </form>
                    <p className="text-center mt-3">
		                <Link to="/auth/login">I already have an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
