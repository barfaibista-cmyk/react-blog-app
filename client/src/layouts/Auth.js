import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './frontend.css';

const Auth = () => {
	useEffect(() => {
		if(document.body.classList.contains('login-page') === false && document.body.classList.contains('bg-body-secondary') === false) {
			if(document.body.classList.contains('bg-body-secondsry') === false) {
				document.body.classList.add('bg-body-secondary');
			} else {
				document.body.classList.remove('bg-body-secondary');
			}

			if(document.body.classList.contains('login-page') === false) {
				document.body.classList.add('login-page');
				document.body.classList.remove('register-page');
			} else {
				document.body.classList.remove('login-page');
				document.body.classList.add('register-page');
			}
 		}
	},[]);

	return (
		<>
			<main className="container">
				<Outlet />
			</main>
		</>
	)
}

export default Auth;

