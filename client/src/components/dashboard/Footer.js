import { useAuth } from './../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Spinner from './Spinner';

const Footer = () => {
	const { currentUser, loading } = useAuth();
	const location = useLocation();
    if (loading) return <Spinner />;

	return (
		<footer id="footer" className="footer light-background">
		    <div className="container">
		    	{ location.pathname.split('/')[2] !== undefined && (
		    	<p>Login as <strong>{currentUser ? currentUser.name : currentUser.email}</strong></p>) }
			</div>
		    <div className="container copyright text-center mt-4">
		        <p>
		            © <span>Copyright</span> <strong className="px-1 sitename">Serenity</strong> <span>All Rights Reserved</span>
		        </p>
		        <div className="credits">
		            <p>Designed by <Link to="https://bootstrapmade.com/">BootstrapMade</Link>. Made with ♥️ and <b>React.js</b></p>
		        </div>
		    </div>

		</footer>
	)
};

export default Footer;
