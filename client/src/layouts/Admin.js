import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './../components/dashboard/Navbar';
import Footer from './../components/dashboard/Footer';

const Admin = () => {
	useLayoutEffect(() => {
		document.body.classList.remove('login-page');
		document.body.classList.remove('bg-body-secondary');
	},[])

	return (
		<>
			<Navbar />
			<Outlet />
			<Footer />
		</>
	)
}

export default Admin;
