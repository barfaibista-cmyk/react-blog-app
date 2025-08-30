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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const albumSeotitle = location.pathname.split('/')[3];

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [albumsRes, photosRes] = await Promise.all([
                axios.get('/api/albums'),
                axios.get(`/api/galleries/${albumSeotitle}`)
            ]);
            setAlbums(albumsRes.data);
            setPhotos(photosRes.data);
        } catch(err) {
            console.error("Failed to fetch data.", err);
            setError("Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    }, [albumSeotitle]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const albumIndex = albums.findIndex(album => album.seotitle === albumSeotitle);
    const previousAlbum = albumIndex > 0 ? albums[albumIndex - 1] : null;
    const nextAlbum = albumIndex < albums.length - 1 ? albums[albumIndex + 1] : null;

    const [showModal, setShowModal] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [photoDetail, setPhotoDetail] = useState(null);
    const [showPhotoDetailModal, setShowPhotoDetailModal] = useState(false);

    const handleViewDetailPhoto = (photo) => {
        setPhotoDetail(photo);
        setShowPhotoDetailModal(true);
        setSuccess('');
        setError('');
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

    const handleDeletePhoto = async (id) => {
        if (window.confirm('Are you sure want to delete this photo?')) {
            setIsLoading(true);
            try {
                await axios.delete(`/api/galleries/${id}`);
                setSuccess('Photo has been deleted successfully!');
                fetchAllData();
            } catch (err) {
                console.error('Failed to delete photo:', err);
                setError(err.response?.data?.message || 'Failed to delete photo.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmitPhoto = () => {
        fetchAllData();
        setShowModal(false);
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
    if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

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
                                                                <button type="button" className="m-1 btn btn-success" onClick={() => handleViewDetailPhoto(photo)}><i className="bi bi-eye"></i></button>
                                                                <button type="button" className="m-1 btn btn-warning" onClick={() => handleEditPhoto(photo)}><i className="bi bi-pencil"></i></button>
                                                                <button type="button" className="m-1 btn btn-danger" onClick={() => handleDeletePhoto(photo.id)}><i className="bi bi-trash"></i></button>
                                                            </div>
                                                            <img className="img-fluid" src={`http://localhost:3001/api/images/${albumSeotitle}/${photo.picture}`} alt={photo.title} />
                                                            <p className="text-center mt-2">{photo.title}</p>
                                                        </div>
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
                                                        <Link to={`/dashboard/galleries/${previousAlbum?.seotitle}`}>Previous Album</Link>
                                                        <br />
                                                        <div className="text-wrap" style={{ width: '20rem' }}>
                                                            <p>{previousAlbum?.title}</p>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>

                                        <div>
                                            {
                                                nextAlbum && (
                                                    <>
                                                        <Link className="float-end" to={`/dashboard/galleries/${nextAlbum?.seotitle}`}>Next Album</Link>
                                                        <br />
                                                        <div className="text-wrap" style={{ width: '20rem' }}>
                                                            <p className="text-end">{nextAlbum?.title}</p>
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
                        allAlbums={albums}
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
