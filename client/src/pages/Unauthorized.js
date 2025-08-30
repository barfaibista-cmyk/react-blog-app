import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="container mt-5 text-center">
            <h1>403 - Access denied</h1>
            <p className="lead">Sorry, you have not suffient to acccess this page.</p>
            <Link to="/dashboard" className="text-white btn btn-primary">Go to Dashboard</Link>
        </div>
    );
};

export default Unauthorized;
