import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "./../../../components/Spinner";
import Breadcrumb from "./../../../components/dashboard/Breadcrumb";

const Single = () => {
	const [album, setAlbum] = useState({});
	const [albums, setAlbums] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const seotitle = location.pathname.split('/')[4];

	useEffect(() => {
		const fetchAlbum = async () => {
			try {
			    const res = await axios.get(`/api/albums/${seotitle}`);
			    setAlbum(res.data);
		    } catch(err) {
				setError(err.message);
		    } finally {
				setLoading(false);
		    }
		};
		fetchAlbum();
	},[seotitle]);

	const {id, title, seotitle } = album;

	useEffect(() => {
		const fetchAlbums = async () => {
			try {
			    const res = await axios.get('/api/albums');
			    setAlbums(res.data);
		    } catch(err) {
				setError(err.message);
		    } finally {
				setLoading(false);
		    }
		};
		fetchAlbums();
	},[albums]);


	if(loading) return <Spinner />
	if(error) return <p>{error.mesaage}</p>

	return (
		<main className="main">
	  		<Breadcrumb />
	  		<section id="starter-section" className="starter-section section">
				<div className="container-fluid">
		    		<Link to="/dashboard/galleries" className="my-3 text-secondary btn btn-outline-secondary"><i className="bi bi-arrow-left"></i> Go back</Link>

					<article className="article">
						{
							albums && (
								<div className="d-flex justify-content-between mt-3">
									<div>
									{
										previousAlbum ? (
										<>
											<Link to={`/dashboard/albums/${previousAlbum['seotitle']}`}>Previous Album</Link>
											<br />
											<div className="text-wrap" style={{ width: '20rem' }}>
												<p>{previousAlbum['title']}</p>
											</div>
										</>
										) : null
									}
									</div>

									<div>
									{
										nextAlbum ? (
										<>
											<Link className="float-end" to={`/dashboard/albums/${nextAlbum['seotitle']}`}>Next Album</Link>
											<br />
											<div className="text-wrap" style={{ width: '20rem' }}>
												<p className="text-end">{nextAlbum['title']}</p>
											</div>
										</>
										) : null
									}
									</div>
								</div>
							)
						}
					</article>
				</div>
			</section>
		</main>
	);
};

export default Single;
