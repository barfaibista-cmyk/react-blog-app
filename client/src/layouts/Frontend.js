import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './../components/Navbar';
import Carousel from './../components/Carousel';
import Footer from './../components/Footer';
import BackToTop from './../components/BackToTop';

import './frontend.css';

const Frontend = () => {
	const location = useLocation();
	useEffect(() => {
		AOS.init({
			duration: 600,
		    easing: 'ease-in-out',
		    once: true,
		    mirror: false
		});
	},[]);

	return (
		<>
			<Navbar />
			<main className="main">
				{ location.pathname.split('/')[1] === 'blog' && <Carousel /> }
				<Outlet />
			</main>
			<Footer />
			<BackToTop />
		</>
	)
}

export default Frontend;

