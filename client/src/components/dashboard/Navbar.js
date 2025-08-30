import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './../../contexts/AuthContext';

const Navbar = () => {
    const { currentUser, loading, doLogout } = useAuth();
    const [isMobileNavActive, setIsMobileNavActive] = useState(false);

    const [openDropdowns, setOpenDropdowns] = useState({});
    const mobileNavToggleRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (mobileNavToggleRef.current) {
            if (isMobileNavActive) {
                document.body.classList.add('mobile-nav-active');
                mobileNavToggleRef.current.classList.add('bi-x');
                mobileNavToggleRef.current.classList.remove('bi-list');
            } else {
                document.body.classList.remove('mobile-nav-active');
                mobileNavToggleRef.current.classList.add('bi-list');
                mobileNavToggleRef.current.classList.remove('bi-x');
            }
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
        if (isMobileNavActive) {
            setIsMobileNavActive(false);
        }
    };

    const handleLogout = async () => {
        try {
            await doLogout();
        } catch (error) {
            console.error("Failed logout:", error.message);
        }
        handleLinkClick();
        navigate('/');
    };

    return (
        <header id="header" className="header d-flex align-items-center sticky-top">
            <div className="container container-xl position-relative d-flex align-items-center">
                <Link to="/" className="logo d-flex align-items-center me-auto">
                    <h1 className="sitename">Serenity</h1>
                </Link>

                <nav id="navmenu" className="navmenu">
                    <ul>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li className="dropdown">

                            <Link to='#' className={openDropdowns['content'] ? 'active' : ''}>
                                <span>Content</span> <i className="bi bi-chevron-down toggle-dropdown" onClick={(e) => handleDropdownToggle(e, 'content')}></i>
                            </Link>

                            <ul className={openDropdowns['content'] ? 'dropdown-active' : ''}>
                                <li><Link to="/dashboard/posts" onClick={handleLinkClick}>Posts</Link></li>
                                <li><Link to="/dashboard/comments" onClick={handleLinkClick}>Comments</Link></li>
                                <li><Link to="/dashboard/categories" onClick={handleLinkClick}>Categories</Link></li>
                                <li><Link to="/dashboard/tags" onClick={handleLinkClick}>Tags</Link></li>
                                <li><Link to="/dashboard/pages" onClick={handleLinkClick}>Pages</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/dashboard/galleries" onClick={handleLinkClick}>Galleries</Link></li>
                        <li><Link to="/dashboard/file-manager" onClick={handleLinkClick}>File Manager</Link></li>
                        <li className="dropdown">

                            <Link to='#' className={openDropdowns['user'] ? 'active' : ''}>
                                <span>User</span> <i className="bi bi-chevron-down toggle-dropdown" onClick={(e) => handleDropdownToggle(e, 'user')}></i>
                            </Link>

                            <ul className={openDropdowns['user'] ? 'dropdown-active' : ''}>
                                <li><Link to="/dashboard/users" onClick={handleLinkClick}>Users</Link></li>
                                <li><Link to="/dashboard/roles" onClick={handleLinkClick}>Roles</Link></li>
                                <li><Link to="/dashboard/permissions" onClick={handleLinkClick}>Permissions</Link></li>
                            </ul>
                        </li>
                        {
                            !loading ? (
                                currentUser ? (
                                    <li>
                                        <Link to="#" className="text-white btn-getstarted" onClick={handleLogout}>Logout</Link>
                                    </li>
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
