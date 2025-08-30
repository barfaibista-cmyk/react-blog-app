import { Link } from 'react-router-dom';

export default function Sidebar(props) {
	return (
		<aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
	        {/* <!--begin::Sidebar Brand--> */}
	        <div className="sidebar-brand">
	            {/* <!--begin::Brand Link--> */}
	            <Link to="./index" className="brand-link">
	                {/* <!--begin::Brand Image--> */}
	                <img
	                    src="img/AdminLTELogo.png"
	                    alt=""
	                    className="brand-image opacity-75 shadow"
	                />
	                {/* <!--end::Brand Image--> */}
	                {/* <!--begin::Brand Text--> */}
	                <span className="brand-text fw-light">AdminLTE 4</span>
	                {/* <!--end::Brand Text--> */}
	            </Link>
	            {/* <!--end::Brand Link--> */}
	        </div>
	        {/* <!--end::Sidebar Brand--> */}

	        {/* <!--begin::Sidebar Wrapper--> */}
	        <div className="sidebar-wrapper">
	            <nav className="mt-2">
	                {/* <!--begin::Sidebar Menu--> */}
	                <ul
	                    className="nav sidebar-menu flex-column"
	                    data-lte-toggle="treeview"
	                    role="menu"
	                    data-accordion="false"
	                    ref={props.sidebarmenu}
	                >
	                    <li className="nav-item menu-open">
	                        <Link to="#" className="nav-link active">
	                            <i className="nav-icon bi bi-speedometer"></i>
	                            <p>
	                                Dashboard
	                                <i className="nav-arrow bi bi-chevron-right"></i>
	                            </p>
	                        </Link>
	                        <ul ref={props.navtreeview} className="nav nav-treeview">
	                            <li className="nav-item">
	                                <Link to="./index" className="nav-link active">
	                                    <i className="nav-icon bi bi-circle"></i>
	                                    <p>
	                                        Dashboard v1
	                                    </p>
	                                </Link>
	                            </li>
	                            <li className="nav-item">
	                                <Link to="./index2" className="nav-link">
	                                    <i className="nav-icon bi bi-circle"></i>
	                                    <p>
	                                        Dashboard v2
	                                    </p>
	                                </Link>
	                            </li>
	                            <li className="nav-item">
	                                <Link to="./index3" className="nav-link">
	                                    <i className="nav-icon bi bi-circle"></i>
	                                    <p>
	                                        Dashboard v3
	                                    </p>
	                                </Link>
	                            </li>
	                        </ul>
	                    </li>
	                    <li className="nav-header">EXAMPLES</li>
	                    <li className="nav-item">
	                        <Link to="#" className="nav-link">
	                            <i className="nav-icon bi bi-box-arrow-in-right"></i>
	                            <p>
	                                Auth
	                                <i className="nav-arrow bi bi-chevron-right"></i>
	                            </p>
	                        </Link>
	                        <ul className="nav nav-treeview">
	                            <li className="nav-item">
	                                <Link to="#" className="nav-link">
	                                    <i className="nav-icon bi bi-box-arrow-in-right"></i>
	                                    <p>
	                                        Version 1
	                                        <i className="nav-arrow bi bi-chevron-right"></i>
	                                    </p>
	                                </Link>
	                                <ul className="nav nav-treeview">
	                                    <li className="nav-item">
	                                        <Link to="./examples/login" className="nav-link">
	                                            <i className="nav-icon bi bi-circle"></i>
	                                            <p>
	                                                Login
	                                            </p>
	                                        </Link>
	                                    </li>
	                                    <li className="nav-item">
	                                        <Link to="./examples/register" className="nav-link">
	                                            <i className="nav-icon bi bi-circle"></i>
	                                            <p>
	                                                Register
	                                            </p>
	                                        </Link>
	                                    </li>
	                                </ul>
	                            </li>
	                            <li className="nav-item">
	                                <Link to="#" className="nav-link">
	                                    <i className="nav-icon bi bi-box-arrow-in-right"></i>
	                                    <p>
	                                        Version 2
	                                        <i className="nav-arrow bi bi-chevron-right"></i>
	                                    </p>
	                                </Link>
	                                <ul className="nav nav-treeview">
	                                    <li className="nav-item">
	                                        <Link to="./examples/login-v2" className="nav-link">
	                                            <i className="nav-icon bi bi-circle"></i>
	                                            <p>
	                                                Login
	                                            </p>
	                                        </Link>
	                                    </li>
	                                    <li className="nav-item">
	                                        <Link to="./examples/register-v2" className="nav-link">
	                                            <i className="nav-icon bi bi-circle"></i>
	                                            <p>
	                                                Register
	                                            </p>
	                                        </Link>
	                                    </li>
	                                </ul>
	                            </li>
	                            <li className="nav-item">
	                                <Link to="./examples/lockscreen" className="nav-link">
	                                    <i className="nav-icon bi bi-circle"></i>
	                                    <p>
	                                        Lockscreen
	                                    </p>
	                                </Link>
	                            </li>
	                        </ul>
	                    </li>
	                    <li className="nav-item">
	                        <Link to="#" className="nav-link">
	                            <i className="nav-icon bi bi-circle text-info"></i>
	                            <p>
	                                Informational
	                            </p>
	                        </Link>
	                    </li>
	                </ul>
	                {/* <!--end::Sidebar Menu--> */}
	            </nav>
	        </div>
	        {/* <!--end::Sidebar Wrapper--> */}
	    </aside>
	)
}
