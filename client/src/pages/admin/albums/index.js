import api from './../../../api/axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Spinner from './../../../components/dashboard/Spinner';

export default function Albums() {
	// const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	const [loading,setLoading] = useState(true);

	const [albums, setAlbums] = useState([]);
	useEffect(() => {
		const fetchAlbums = async () => {
			try {
				const resp = await api.get('/albums');
				setAlbums(resp.data);
			} catch(err) {
				console.log(err);
				setLoading(true);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchAlbums();
	},[]);

	const [photos, setPhotos] = useState([]);
	useEffect(() => {
		const fetchPhotos = async () => {
			try {
				const resp = await api.get('/galleries');
				setPhotos(resp.data);
			} catch(err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchPhotos();
	},[]);

	if(loading) return <Spinner/>
	if(error) return <p>{error.message}</p>

	return (
		<main className="main">
	  		<Breadcrumb />
			<section id="starter-section" className="starter-section section">
                <div className="container-fluid">

					<section id="blog-details" className="blog-details section">
						<Link to="/albums/write" className="text-white btn btn-primary mb-3"><i className="bi bi-plus"></i> Create Album</Link>

				        <div className="container-fluid">
				            <article className="article">
			                    <div className="row">
			                        {
			                            albums.map((album, idx) => {
			                                const thumbnailPhoto = photos.find(photo => photo.album_id === album.id);
			                                const thumbnailUrl = thumbnailPhoto ? `../../../upload/${album.seotitle}/${thumbnailPhoto.picture}` : '../../../upload/default-150x150.png';

			                                return (
			                                    <div key={idx} className="col-md-3 mb-3">
			                                    	<Link to={`/dashboard/galleries/${album.seotitle}`} state={album}>
				                                        <div className="card">
				                                            <img src={thumbnailUrl} alt={album.title} className="card-img-top" />
				                                            <div className="card-body">
				                                                <p className="card-text"><strong>{album.title}</strong></p>
				                                            </div>
				                                        </div>
			                                        </Link>
			                                    </div>
			                                );
			                            })
			                        }
			                    </div>
				            </article>
			            </div>
		            </section>

                </div>

			</section>
		</main>
	);
}
