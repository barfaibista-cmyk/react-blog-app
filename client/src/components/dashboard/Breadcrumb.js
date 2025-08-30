import { useLocation, Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function Breadcrumb() {
	const location  = useLocation();
	const pathnames = location.pathname.split('/').filter((x) => x);
	const state = useLocation().state;

	const breadcrumb = useMemo(() => {
		return (
		    <div className="page-title light-background">
			    <div className="container">
			        <nav className="breadcrumbs">
				        <ol>
				            {
				            	pathnames.map((name, index) => {
						            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
						            const isLast = index === pathnames.length - 1;
						            return (
						                <li key={routeTo} className={isLast ? 'current' : ''}>
							                {isLast ? (
							                  state?.name ? state?.name : formatText(name)
							                ) : (
							                  <Link to={routeTo}>{formatText(name)}</Link>
							                )}
						                </li>
						            );
					            })
				            }
				        </ol>
			        </nav>
			        <h1>{state?.name ? state?.name : formatText(pathnames[pathnames.length - 1])}</h1>
			    </div>
		    </div>
		);
	}, [pathnames, state?.name]);

	return breadcrumb;
}

function formatText(text) {
	return text.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
