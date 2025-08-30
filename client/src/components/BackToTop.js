import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BackToTop = () => {
	const elRef = useRef(null);
	const onScroll = () => {
		if(elRef.current) {
			if(window.scrollY >= 100) {
				elRef.current.style.visibility = 'visible';
				elRef.current.style.display = 'block';
			} else {
				elRef.current.style.visibility = 'hidden';
				elRef.current.style.display = 'none';
			}
		}
	}

	const handleScroll = () => {
		if(elRef.current) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		elRef.current?.addEventListener('click', handleScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			// eslint-disable-next-line
			elRef.current?.removeEventListener('click', handleScroll);
		}
	},[elRef]);
	
	return (
		<Link to="#" ref={elRef} className="scroll-top d-flex align-items-center justify-content-center">
			<i className="bi bi-arrow-up"></i>
		</Link>
	)
}

export default BackToTop;
