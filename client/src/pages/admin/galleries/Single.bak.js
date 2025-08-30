import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Spinner from "./../../../components/Spinner";
import Breadcrumb from "./../../../components/dashboard/Breadcrumb";
import { useAuth } from "./../../../contexts/AuthContext";
import PhotoModal from './PhotoModal';
import PhotoDetailModal from './PhotoDetailModal';

const Single = () => {
	const { hasPermission } = useAuth();
	const [photos, setPhotos] = useState([]);
	const [albums, setAlbums] = useState([]);
	const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const seotitle = location.pathname.split('/')[3];

	useEffect(() => {
		const fetchAlbums = async () => {
			try {
			    const res = await axios.get('/api/albums');
			    setAlbums(res.data);
		    } catch(err) {
				setError(err.message);
		    } finally {
				setIsLoading(false);
		    }
		};
		fetchAlbums();
	},[]);

	useEffect(() => {
		const fetchPhotos = async () => {
			try {
			    const res = await axios.get(`/api/albums/${seotitle}`);
			    setPhotos(res.data);
		    } catch(err) {
				setError(err.message);
		    } finally {
				setIsLoading(false);
		    }
		};
		fetchPhotos();
	},[seotitle]);

	const currentIndex = albums.filter((val, idx) => {
		let idxValue;
		if(val.seotitle.indexOf(`${seotitle}`) === 0 || val.seotitle === seotitle) {
			idxValue = idx || val.id;
		}
		return idxValue;
	});

	const getPreviousAlbum = (array, index) => array[index - 2];
	const getNextAlbum = (array, index) => array[index];
	const previousAlbum = getPreviousAlbum(albums, currentIndex[0]?.id);
	const nextAlbum     = getNextAlbum(albums, currentIndex[0]?.id);

    const [showModal, setShowModal] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);
	const [photoDetail, setPhotoDetail] = useState({});	
	const [showPhotoDetailModal, setShowPhotoDetailModal] = useState(false);

    const handleViewDetailPhoto = (photo) => {
        setPhotoDetail(photo);
        setShowPhotoDetailModal(true);
    };

    const handleAddPhoto = () => {
        setCurrentPhoto(null);
        setShowModal(true);
        setSuccess('');
        setError('');
    };

    const handleEditPhoto = (photo) => {
        setCurrentPhoto(photo);
        setShowModal(true);
        setSuccess('');
        setError('');
    };

    const handleDeletePhoto = (id) => {
        if (window.confirm('Are you sure want to delete this photo?')) {
            setIsLoading(true);
            setSuccess('');
            setError('');
            setTimeout(() => {
                setPhotos(photos.filter(photo => photo.id !== id));
                setSuccess('Photo has been deleted suuccessfully!');
                setIsLoading(false);
            }, 300);
        }
    };

    const handleSubmitPhoto = (photoData) => {
        setIsLoading(true);
        setSuccess('');
        setError('');

        setTimeout(() => {
            if (photoData.id) {
                setPhotos(photos.map(photo =>
                    photo.id === photoData.id ? photoData : photo
                ));
                setSuccess('Photo has been updated succesafully!');
            } else {
                const newId = (photos.length > 0 ? Math.max(...photos.map(a => parseInt(a.id))) + 1 : 1).toString();
                setPhotos([...photos, { ...photoData, id: newId }]);
                setSuccess('Photo has been created suuccessfully!');
            }
            setShowModal(false);
            setIsLoading(false);
        }, 500);
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentPhoto(null);
        setError('');
    }, []);

	const handleClosePhotoDetailModal = useCallback(() => {
        setShowPhotoDetailModal(false);
        setPhotoDetail(null);
        setError('');
    }, []);

	if(isLoading) return <Spinner />
	if(error) return <p>{error.mesaage}</p>

	return (
		<main className="main">
	  		<Breadcrumb />
	  		<section id="starter-section" className="starter-section section">
				<div className="container-fluid">

					<article className="article">
						{success && (<div className="alert alert-success" role="alert">{success}</div>)}
				    	<div className="d-flex justify-content-between">
				    		<div>
			    				<Link to="/dashboard/galleries" className="text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>
		    				</div>
				            <div>
				                { hasPermission('create-galleries') && (<button onClick={handleAddPhoto} className="btn btn-primary"><i className="bi bi-plus"></i>Add New Photo</button>) }
				            </div>
			            </div>

						{
							albums && (
								<div className="container-fluid mt-3">
									<div className="row">
										{
											photos.length > 0 ? (
												photos.map((photo, idx) => (
													<div key={idx} className="col-md-4 mb-3">
														<div className="position-relative">
															<div className="position-absolute top-0 end-0">
																<button type="button" className="m-1 btn btn-success" onClick={() => handleViewDetailPhoto(photo.id)}><i className="bi bi-eye"></i></button>
																<button type="button" className="m-1 btn btn-warning" onClick={() => handleEditPhoto(photo.id)}><i className="bi bi-pencil"></i></button>
																<button type="button" className="m-1 btn btn-danger" onClick={() => handleDeletePhoto(photo.id)}><i className="bi bi-trash"></i></button>
															</div>
														</div>
														<img className="img-fluid" src={`../../../../upload/${photo.seotitle}/${photo.picture}`} alt={photo.gtitle} />
														<p className="text-center mt-2">{photo.gtitle}</p>
													</div>
												))
											) : (
												<p className="text-center">No data to show</p>
											)
										}
									</div>

									<div className="d-flex justify-content-between mt-3">
										<div>
										{
											previousAlbum && (
											<>
												<Link to={`/dashboard/galleries/${previousAlbum['seotitle']}`}>Previous Album</Link>
												<br />
												<div className="text-wrap" style={{ width: '20rem' }}>
													<p>{previousAlbum['title']}</p>
												</div>
											</>
											)
										}
										</div>

										<div>
										{
											nextAlbum && (
											<>
												<Link className="float-end" to={`/dashboard/galleries/${nextAlbum['seotitle']}`}>Next Album</Link>
												<br />
												<div className="text-wrap" style={{ width: '20rem' }}>
													<p className="text-end">{nextAlbum['title']}</p>
												</div>
											</>
											)
										}
										</div>
									</div>
								</div>
							)
						}
					</article>

					<PhotoModal
		                show={showModal}
		                onClose={handleCloseModal}
		                onSubmit={handleSubmitPhoto}
		                photoData={currentPhoto}
		            />

		            <PhotoDetailModal
		                show={showPhotoDetailModal}
		                onClose={handleClosePhotoDetailModal}
		                photoData={photoDetail}
		            />
				</div>
			</section>
		</main>
	);
};

export default Single;
