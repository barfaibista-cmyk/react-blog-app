import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './../contexts/AuthContext';
import Spinner from './Spinner';

const Navbar = () => {
	const { currentUser, loading, doLogout } = useAuth();
    const [isMobileNavActive, setIsMobileNavActive] = useState(false);
	const [menu, setMenu] = useState([]);
	const [openDropdowns, setOpenDropdowns] = useState({});
	const mobileNavToggleRef = useRef(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMenu = async () => {
			try {
				const res = await axios.get('/api/menu');
				setMenu(res.data);
			} catch(err) {
				setError(err);
			} finally {
				setIsLoading(false)
			}
		}
		fetchMenu()
	},[])

	useEffect(() => {
        if (isMobileNavActive) {
            document.body.classList.add('mobile-nav-active');
		    mobileNavToggleRef.current?.classList.add('bi-x');
		    mobileNavToggleRef.current?.classList.remove('bi-list');
        } else {
            document.body.classList.remove('mobile-nav-active');
		    mobileNavToggleRef.current?.classList.add('bi-list');
		    mobileNavToggleRef.current?.classList.remove('bi-x');
        }
    }, [isMobileNavActive]);

    const handleToggleMobileNav = () => {
        setIsMobileNavActive(!isMobileNavActive);
    };

	const handleDropdownToggle = (evt, id) => {
        evt.preventDefault();
        evt.stopPropagation();
        setOpenDropdowns(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

	const handleLinkClick = () => {
		if(document.body.classList.contains('mobile-nav-active') !== false) {
			document.body.classList.remove('mobile-nav-active');
		    mobileNavToggleRef.current.classList.add('bi-list');
		    mobileNavToggleRef.current.classList.remove('bi-x');
		}
	}

	const handleLogout = async () => {
        try {
            await doLogout();
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
        handleLinkClick();
        navigate('/');
    }

	const treeMenu = (elements, parentId = 0) => {
        const children = elements.filter(element => element.parent === parentId);
        if (children.length === 0) return null;

        return (
            <>
                {
                    children.map(child => {
                        const hasChildren = elements.some(element => element.parent === child.id);
                        return (
                            <li key={child.id} className={hasChildren ? "dropdown" : ""}>
                                <Link
                                    to={hasChildren ? "#" : `${child.url}`}
                                    onClick={(e) => {
                                        if (hasChildren) {
                                            handleDropdownToggle(e, child.id);
                                        } else {
                                            handleLinkClick();
                                        }
                                    }}
                                >
                                    {child.title}
                                    {hasChildren && (
                                        <i className={`bi bi-chevron-down toggle-dropdown ${openDropdowns[child.id] ? 'dropdown-active' : ''}`}></i>
                                    )}
                                </Link>
                                {hasChildren && (
                                    <ul className={openDropdowns[child.id] ? "dropdown-active" : ""}>
                                        {treeMenu(elements, child.id)}
                                    </ul>
                                )}
                            </li>
                        )
                    })
                }
            </>
        )
    }

    if(isLoading) return <Spinner/>

    return (
        <header id="header" className="header d-flex align-items-center sticky-top">
            <div className="container container-xl position-relative d-flex align-items-center">
				<Link to="/" className="logo d-flex align-items-center me-auto">
			        <h1 className="sitename">Serenity</h1>
			    </Link>

                <nav id="navmenu" className="navmenu">
					<ul>
						{!error ? treeMenu(menu) : null}
						{
							!loading ? (
								currentUser ? (
									<>
										<li>
											<Link to="/dashboard" className="text-white btn-getstarted">Dashboard</Link>
										</li>
										<li>
											<Link to="#" className="text-white btn-getstarted" onClick={handleLogout}>Logout</Link>
										</li>
									</>
								) : (
									<li>
										<Link to="/auth/login" className="text-white btn-getstarted">Login</Link>
									</li>
								)
							) : (
								null
							)
						}
					</ul>
                    <i ref={mobileNavToggleRef} className="mobile-nav-toggle d-xl-none bi bi-list" onClick={handleToggleMobileNav}></i>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
