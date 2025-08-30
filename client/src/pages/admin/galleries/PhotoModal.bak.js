import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal } from 'bootstrap';
import Select from 'react-select';

const PhotoModal = ({ show, onClose, onSubmit, photoData, allAlbums }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
    const [title, setTitle] = useState(photoData?.title || '');
	const [selectedAlbum, setSelectedAlbum] = useState(null);
	const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

	const albumOptions = useMemo(() => {
        if (!allAlbums) return [];
        return allAlbums.map(album => ({
            value: album.id,
            label: album.atitle,
        }));
    }, [allAlbums]);

	const [file, setFile] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});
	const [imagePreview, setImagePreview] = useState(
		photoData?.picture ? `/upload/${photoData?.picture}` : null
	);
	const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setImagePreview(photoData?.img ? `/upload/${photoData.img}` : null);
        }
    };

	const validateForm = () => {
        const errors = {};
        if (!title.trim()) {
            errors.title = 'Title & Description photo is required.';
            return;
        }
        if (!description.trim()) {
            errors.descriptions = 'Description photo is required.';
            return;
        }
        if (!selectedAlbum) {
            errors.selectedAlbum = 'Album name is required to choose';
            return;
        }
        if (!photoData && !file) {
            errors.photoData = 'You should upload picture for new new photo';
            errors.file = 'You should upload picture for new new photo';
            return;
        }
        if (file) {
            const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!acceptedImageTypes.includes(file.type)) {
                errors.file = 'File must be an image (jpeg, png, gif, atau webp).';
                return;
            }
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

	const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        if (!validateForm()) {
            return;
        }
        let imgUrl = photoData?.img || '';
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                const res = await axios.post("/api/galleries/upload", formData, {
                    headers: { 'Content-Type' : 'multipart/form-data' }
                });
                imgUrl = res.data;
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to upload picture.');
                setIsSubmitting(false);
                return;
            }
        }

        onSubmit({
            id: photoData ? photoData.id : null,
            title,
            description,
            img: imgUrl,
            album_id: selectedAlbum.value,
        });
    };

	/*
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
        setSuccess('');
       	setIsSubmitting(true);

        if (!validateForm()) {
            return;
        }

		let imgUrl = photoData?.picture || '';
		if(file) {
			imgUrl = await upload(file);
			console.log(imgUrl);
			if (!imgUrl) {
                setIsSubmitting(false);
                return;
            }
		}

		try {
		    if(photoData) {
		    	await axios.put(`/api/galleries/${photoData?.id}`, {
		    		title,
		    		seotitle,
		        	picture: imgUrl, 
		        	updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			    });
		    	setSuccess('User has been updated successfully');
		    } else {
			    await axios.post(`/api/galleries`, {
		    		title,
		    		seotitle,
		        	picture: imgUrl, 
		        	created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			    });
		    	setSuccess('User has been created successfully');
		    }
		} catch (err) {
		    console.error(err);
		    setError(err.message);
		} finally {
			setTimeout(() => {
				setIsSubmitting(false);
			}, 2000)
		}
	}
	*/

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Modal instance created successfully (PhotoModal).");
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
			setSelectedAlbum(null);
            setTitle('');
            setError('');
            setIsSubmitting(false);
            if (document.getElementById('photoFile')) {
                document.getElementById('photoFile').value = '';
            }
        };

        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
                console.log("Bootstrap Modal instance disposed (PhotoModal).");
            }
        };
    }, [onClose]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("PhotoModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }
        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    useEffect(() => {
    	if (photoData) {
            setTitle(photoData.title);
            setDescription(photoData.description);
            setImagePreview(photoData.img ? `/upload/${photoData.img}` : null);
            setFile(null);
    		const initialAlbum = albumOptions.find(opt => opt.value === photoData.album_id);
            setSelectedAlbum(initialAlbum || null);        
        } else {
            setTitle('');
            setDescription('');
            setImagePreview(null);
            setFile(null);
            setSelectedAlbum(null);
        }
        setError('');
    }, [photoData, albumOptions]);

return (
        <div className="modal fade" ref={modalRef} id="photoModal" tabIndex="-1" aria-labelledby="photoModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header ${photoData ? 'bg-primary' : 'bg-secondary'}`}>
                        <h5 className="modal-title text-white" id="photoModalLabel">
                            {photoData ? 'Edit Photo' : 'Add New Photo'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                        {/* success && (<div className="alert alert-success" role="alert">{success}</div>) */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="photoTitle" className="form-label">Photo Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                                {validationErrors.title && (<div className="invalid-feerback">{validationErrors.title}</div>)}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="photoDescription" className="form-label">Description</label>
                                <textarea
                                    id="description"
                                    className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows="3"
                                    disabled={isSubmitting}
                                ></textarea>
                                {validationErrors.description && (<div className="invalid-feerback">{validationErrors.description}</div>)}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="albumname" className="form-label">Albums Name</label>
                                <Select
                                    id="albumname"
                                    options={albumOptions}
                                    className={`${validationErrors.description ? 'is-invalid' : ''}`}
                                    value={selectedAlbum}
                                    onChange={(option) => setSelectedAlbum(option)}
                                    isDisabled={isSubmitting}
                                    placeholder="-- Select Album --"
                                    isClearable
                                />
                                {validationErrors.selectedAlbums && (<div className="invalid-feerback">{validationErrors.selectedAlbums}</div>)}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="picture" className="form-label">Upload Photo</label>
                                <input
                                    type="file"
                                    id="picture"
                                    className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    accept="image/jpeg, image/png, image/gif, image/webp"
                                />
                                {validationErrors.photoData && (<div className="invalid-feedback">{validationErrors.photoData}</div>)}
                                {validationErrors.file && (<div className="invalid-feedback">{validationErrors.file}</div>)}
                            </div>
                            {imagePreview && (
                                <div className="mt-3 text-center">
                                    <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                                    <button 
                                        type="button" 
                                        className="btn btn-sm btn-danger mt-2" 
                                        onClick={() => {
                                            setFile(null);
                                            setImagePreview(null);
                                            if (document.getElementById('photoFile')) {
                                                document.getElementById('photoFile').value = '';
                                            }
                                        }}
                                    >
                                        Remove Picture
                                    </button>
                                </div>
                            )}
                            <div className="modal-footer px-0 pb-0 pt-3 border-top-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : (photoData ? 'Update Photo' : 'Add Photo')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;

/*
return (
    <div className="modal fade" ref={modalRef} id="photoModal" tabIndex="-1" aria-labelledby="photoModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className={`modal-header ${photoData ? 'bg-primary' : 'bg-secondary'}`}>
                    <h5 className="modal-title text-white" id="photoModalLabel">
                        {photoData ? 'Edit Photo' : 'Add New Photo'}
                    </h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">{error}</div>
                    )}
                    {success && (
                        <div className="alert alert-success" role="alert">{success}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="albums" className="form-label">Albums</label>
                            <Select
                                id="active"
                                options={albumsOptions}
                                disabled={isSubmitting}
                                placeholder="-- Select Albums --"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Photo Title</label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="seotitle" className="form-label">Seotitle</label>
                            <input
                                type="text"
                                id="seotitle"
                                className="form-control"
                                value={seotitle}
                                onChange={(e) => setSeotitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="picture" className="form-label">User Picture</label>
                            <input className={`form-control ${validationErrors.picture ? 'is-invalid' : ''}`} type="file" id="picture" name="picture" onChange={handleImageChange} ref={fileInputRef} />
                        	{validationErrors.picture && (<div className="invalid-feedback">{validationErrors.picture}</div>)}
                        </div>
                        {imagePreview && (
                            <div className="mt-3 text-center">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="img-thumbnail" 
                                    onClick={triggerFileInput} 
                                    style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        )}

                        {imagePreview && (
                            <div className="text-center mt-2">
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => {
                                        setFile(null);
                                        setImagePreview(null);
                                        if(fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                >
                                    Delete Picture
                                </button>
                            </div>
                        )}

                        <div className="modal-footer px-0 pb-0 pt-3 border-top-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : (photoData ? 'Update Photo' : 'Add Photo')}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
);
*/

/*
const fileInputRef = useRef(null);
const triggerFileInput = () => {
	if(fileInputRef.current) {
		fileInputRef.current.click();
	}
}

const handleImageChange = (evt) => {
    const selectedFile = evt.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
    } else {
    	setFile(null);
		setImagePreview(photoData?.picture ? `/upload/${photoData.picture}` : null);
    }
};

const upload = async (fileToUpload) => {
    try {
        const formData = new FormData();
        formData.append("file", fileToUpload);
        const res = await axios.post("/api/galleries/upload", formData, {
        	headers: {
        		'Content-Type' : 'multipart/form-data'
        	}
        });
        return res.data;
    } catch (err) {
        console.log(err);
		setError(err.message);
		return null;
    }
};
*/
