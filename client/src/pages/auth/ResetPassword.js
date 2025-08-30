import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
	const [pass_confirm, setPass_confirm] = useState('');

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
    	e.preventDefault();
 		setError(null);

	    if (!email || !token || !password || !pass_confirm) {
	        setError("All fields are required.");
	        return;
	    }
	    if (password !== pass_confirm) {
	        setError("Confrim password is not match.");
	        return;
	    }
	    if (password.length < 6) {
	        setError("Password should have at least 6 characters.");
	        return;
	    }

        setLoading(true);
        try {
            const resp = await axios.post('/api/auth/reset-password', { email, token, password, pass_confirm });
            if(resp.message) {
            	setMessage(resp.message);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to process your reset password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="login-box">
            <div className="login-logo">
                <Link to="/"><b>Admin</b>LTE</Link>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {
	                    message && (
		                    <>
		                        <div className="mb-3 alert alert-success" role="alert">
		                            {message}
		                        </div>
		                        <Link to="/auth/login">Login</Link>
	                        </>
	                    )
                    }
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Your Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="input-group-text">
                                <span className="bi bi-envelope"></span>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your Token"
                                name="token"
                                value={token}
                                onChange={(e)=> setToken(e.target.value)}
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
					            name="password"
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
				            	id="pass_confirm"
				            	className="form-control"
					            type="password"
					            name="pass_confirm"
					            placeholder="Confirm Password"
					            value={pass_confirm}
					            onChange={(e) => setPass_confirm(e.target.value)}
				            />
		                    <div className="input-group-text">
		                        <span className="bi bi-lock-fill"></span>
		                    </div>
				        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <button type="submit" className="btn btn-block btn-primary w-100 my-3" disabled={loading}>{loading ? 'Processing...' : 'Reset Password'}</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
