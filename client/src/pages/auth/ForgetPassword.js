import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSentSuccessfully, setEmailSentSuccessfully] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        setEmailSentSuccessfully(false);

        try {
            const response = await axios.post('/api/auth/forget-password', { email });
            setMessage(response.data.message || ['A password reset link has been sent to your email.', 'Please check your email inbox (and spam folder) to continue.']);
            setEmail('');
            setEmailSentSuccessfully(true);
        } catch (err) {
            console.error('Failed to send password reset request:', err);
            setError(err.response?.data?.message || 'Failed to send password reset link. Please try again.');
            setEmailSentSuccessfully(false);
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    return (
        <div className="login-box">
            <div className="login-logo">
                <Link to="/"><b>Admin</b>LTE</Link>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                	{
	                	emailSentSuccessfully ? (
	                		<React.Fragment>
			                    {
			                    	message && (
			                        	<div className="alert alert-danger" role="alert">
				                            {
					                            message.map((m, idx) => (
			                						<p key={idx}>{m}</p>
					                            ))
				                            }
				                        </div>
			                    	)
			                    }
		                		<p className="text-center mt-3">
			                        <Link to="/auth/reset-password">Reset Password</Link>
			                    </p>
	                		</React.Fragment>
	                	) : (
	                		<React.Fragment>
			                	<h4 className="text-center mb-3">Forget Password</h4>
			                	<p>No problem! Enter your email below and we will send instructions to reset your password.</p>
			                    {error && (
			                        <div className="alert alert-danger" role="alert">
			                            {error}
			                        </div>
			                    )}
			                    <form onSubmit={handleSubmit}>
			                        <div className="input-group mb-3">
			                            <input
			                                type='email'
			                                className="form-control"
			                                placeholder="Your email"
			                                name="email"
			                                value={email}
			                                onChange={(e)=> setEmail(e.target.value)}
			                            />
			                            <div className="input-group-text">
			                                <span className="bi bi-envelope"></span>
			                            </div>
			                        </div>
			                        <div className="d-flex justify-content-center align-items-center">
			                            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Instruction'}</button>
			                        </div>
			                    </form>
			                    <p className="text-center mt-3">
			                        <Link to="/auth/login">Login</Link>
			                    </p>
			                    <p className="text-center">
			                        <Link to="/auth/register" className="text-center"> Need an account? </Link>
			                    </p>
	                		</React.Fragment>
	                	)
                	}
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;
