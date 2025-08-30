import 'bootstrap-icons/font/bootstrap-icons.css';
import Breadcrumb from './../../components/dashboard/Breadcrumb';
import Spinner from './../../components/dashboard/Spinner';
import { useEffect } from 'react';
import { useAuth } from './../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/auth/login');
        }
    }, [currentUser, loading, navigate]);

    if (loading) return <Spinner />;

	return (
		<main className="main">
	  		<Breadcrumb />
			<section id="starter-section" className="starter-section section">
		        <div className="container text-center">
		            <div className="card p-5 shadow-lg">
						<h2>Welcome,  {currentUser ? (currentUser ? currentUser.name : currentUser.username) : currentUser?.email}!</h2>
		                { currentUser?.name && (
						<p className="mt-3">This is your dashboard page.</p>)}
		            </div>
		        </div>
			</section>
		</main>
	);
}

