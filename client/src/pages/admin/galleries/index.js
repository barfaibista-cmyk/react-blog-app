import axios from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import Select from 'react-select';
import Pagination from './../../../components/dashboard/Pagination';
import Spinner from './../../../components/dashboard/Spinner';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import { useAuth } from './../../../contexts/AuthContext';

import PhotoModal from './PhotoModal';
import PhotoDetailModal from './PhotoDetailModal';
import CollapsibleTable from './ViewTable';
import ViewList from './ViewList';
import AlbumModal from './AlbumModal';

const Galleries = () => {
	const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = parseInt(currentPage) * parseInt(itemsPerPage);
    const indexOfFirstItem = parseInt(indexOfLastItem) - parseInt(itemsPerPage);
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [photos, setPhotos] = useState([]);
	const [albums, setAlbums] = useState([]);

    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [photosResp, albumsResp] = await Promise.all([
                axios.get('/api/galleries'),
                axios.get('/api/albums')
            ]);
            setPhotos(photosResp.data || []);
            setAlbums(albumsResp.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to fetch comments and posts.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

	const sortedAndFilteredItems = useMemo(() => {
        let sortableItems = [...photos];

        if (query) {
            sortableItems = sortableItems.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                )
            );
        }

        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [photos, query, sortConfig]);

	const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
	const handleSearch = (evt) => {
		setQuery(evt.target.value);
		setCurrentPage(1);
	}

    const arrOptions = Array.from({ length: 5 }, (_, i) => (i + 1) * 5);
	const valueOptions = arrOptions.reduce((acc, elm) => {
	    acc.push({
	        value: elm,
	        label: elm
	    });
	    return acc;
	}, []);

	const [view, setView] = useState('table');
    const [showModal, setShowModal] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);
	const [photoDetail, setPhotoDetail] = useState({});
	const [showPhotoDetailModal, setShowPhotoDetailModal] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState(null);
	
    const handleViewDetailPhoto = (photo) => {
        setPhotoDetail(photo);
        setShowPhotoDetailModal(true);
        setSuccess('');
        setError('');
    };

    const handleAddPhoto = (albums) => {
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
        	try {
				await axios.delete(`/api/galleries/${id}`);
                setPhotos(photos.filter(photo => photo.id !== id));
                setSuccess('Photo has been deleted successfully!');
                setError('');
            } catch (err) {
                console.error("Failed to delete photo:", err);
                setError(err.response?.data?.message || 'Failed to delete photo.');
                setSuccess('');
            }
        }
    }

    const handleSubmitPhoto = (photoData) => {
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

    const handleAddAlbum = () => {
        setCurrentAlbum(null); 
        setShowModal(true);
        setSuccess('');
        setError('');
    };
    
    const handleEditAlbum = (album) => {
        setCurrentAlbum(album); 
        setShowModal(true);
        setSuccess('');
        setError('');
    };

    const handleSubmitAlbum = () => { 
        fetchAllData();
        setShowModal(false);
    };

    const handleDeleteAlbum = async (id) => {
		if (window.confirm('Are you sure want to delete this album?')) {
            try {
                await axios.delete(`/api/albums/${id}`);
                setAlbums(albums.filter(album => album.id !== id));
                setSuccess('Album has been deleted successfully!');
                setError('');
            } catch (err) {
                console.error("Failed to delete album:", err);
                setError(err.response?.data?.message || 'Failed to delete album.');
                setSuccess('');
            }
        }
    }

	if(isLoading) return <Spinner />
	if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

	if(hasPermission('read-galleries') || hasPermission('read-albums')) {
	    return (
	   		<main className="main">
		  		<Breadcrumb />
				<section id="starter-section" className="starter-section section">
					<div className="container-fluid">

						<article className="article">

				            {success && (
				                <div className="alert alert-success alert-dismissible fade show" role="alert">
				                    {success}
				                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				                </div>
				            )}

				            {error && (
				                <div className="alert alert-danger alert-dismissible fade show" role="alert">
				                    {error}
				                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				                </div>
				            )}

					    	<div className="d-flex justify-content-between">
					    		<div>
			                        <div className={`btn-group ${albums.length > 0 ? '' : 'mb-3'}`} role="group">
			                            <button type="button" onClick={() => setView('list')} className={`${view === 'list' ? 'active' : ''} btn btn-outline-primary`}><i className="bi bi-grid"></i> Grid</button>
			                            <button type="button" onClick={() => setView('table')} className={`${view === 'table' ? 'active' : ''} btn btn-outline-primary`}><i className="bi bi-table"></i> Table</button>
			                        </div>
		                        </div>
					            { view === 'list' ? (
						            <div>
						                { hasPermission('create-albums') && (<button onClick={handleAddAlbum} className="btn btn-primary" ><i className="bi bi-plus"></i>Add New Album</button>) }
						            </div>
					            ) : (
						            <div>
						                { hasPermission('create-galleries') && (<button onClick={handleAddPhoto} className="btn btn-primary" ><i className="bi bi-plus"></i>Add New Photo</button>) }
						            </div>
					            )}
				            </div>
				            {
				            	albums.length > 0 ? (
							    	<div className="d-flex justify-content-between my-3">
							    		<div>
				                            <Select
				                            	defaultValue={{ value: itemsPerPage, label: itemsPerPage }}
				                            	onChange={(selectedOptions) => {
				                            		setItemsPerPage(selectedOptions ? selectedOptions.value : null);
				                            		setCurrentPage(1);
			                            		}}
				                            	options={valueOptions}
				                                placeholder="Select per page"
				                            />
										</div>
							    		<div>
											<div className="input-group mb-3">
											    <input type="text" value={query} onChange={handleSearch} className="form-control" placeholder="Type something here" />
											    <button type="button" className="btn btn-primary" onClick={handleSearch}><i className="bi bi-search"></i></button>
											</div>
										</div>
							    	</div>
						    	) : (
						    		null
						    	)
					    	}
					    	{
					    		view === 'table' ? (
						            <CollapsibleTable
						            	data={currentItems}
						            	allAlbums={albums}
						                currentPage={currentPage}
						                itemsPerPage={itemsPerPage}
				    					sortConfig={sortConfig}
				                        onSort={handleSort}
				                        handleViewDetailPhoto={handleViewDetailPhoto}
				                        handleEditPhoto={handleEditPhoto}
				                       	handleDeletePhoto={handleDeletePhoto}
						            />
					    		) : (
				    				<ViewList
				    					allAlbums={albums}
				    					allPhotos={photos}
				    					handleEditAlbum={handleEditAlbum}
                                        handleDeleteAlbum={handleDeleteAlbum}
			    					/>
					    		)
					    	}
					    	{
					    		photos.length > 0 ? (
						            <div className="d-flex justify-content-between">
										<div>
											{
												photos && sortedAndFilteredItems.length > 0 &&  (<p>Showing <strong>{indexOfFirstItem+1}</strong> to <strong>{Math.min(indexOfLastItem, sortedAndFilteredItems.length)}</strong> of <strong>{sortedAndFilteredItems.length}</strong> entries</p>)
											}
										</div>
										<div>
								            <Pagination
								                totalItems={sortedAndFilteredItems.length}
								                currentPage={currentPage}
								                itemsPerPage={itemsPerPage}
								                onPageChange={handlePageChange}
								            />
							            </div>
						            </div>
					            ) : (
					            	null
				            	)
			            	}
			            </article>
			            {
			            	view === 'table' ? (
			            	<>
								<PhotoModal
					                show={showModal}
					                allAlbums={albums}
					                onClose={handleCloseModal}
					                onSubmit={handleSubmitPhoto}
					                photoData={currentPhoto}
					            />

					            <PhotoDetailModal
					                show={showPhotoDetailModal}
					                photoData={photoDetail}
					                onClose={handleClosePhotoDetailModal}
					            />
					            </>
				            ) : (
								<AlbumModal
					                show={showModal}
					                onClose={handleCloseModal}
					                albumData={currentAlbum} 
                                    onSubmitAlbum={handleSubmitAlbum} 
					            />
				            )
			            }

	            	</div>
	            </section>
	        </main>
	    )
    } else {
    	return <Navigate to="/unauthorized" replace={true} />
    }
};

export default Galleries;
