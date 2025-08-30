import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal } from 'bootstrap';
import Select from 'react-select';

const PhotoModal = ({ show, onClose, onSubmit, photoData, allAlbums }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
    const [title, setTitle] = useState(photoData?.title || '');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [content, setContent] = useState(photoData?.content || '');
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const fileInputRef = useRef(null);

    const albumOptions = useMemo(() => {
        if (!allAlbums) return [];
        return allAlbums.map(album => ({
            value: album.id,
            label: album.title,
            seotitle: album.seotitle
        }));
    }, [allAlbums]);

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
        };

        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
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
        setTitle(photoData?.title || '');
        setContent(photoData?.content || '');
        setFile(null);
        setImagePreview(null);

        if (photoData?.picture && photoData?.aseotitle) {
            setImagePreview(`http://localhost:3001/api/images/${photoData.aseotitle}/${photoData.picture}`);
        } else {
            setImagePreview(null);
        }

        if (photoData?.album_id) {
            const album = allAlbums.find(a => a.id === photoData.album_id);
            setSelectedAlbum(albumOptions.find(opt => opt.value === photoData.album_id) || album || null);
        } else {
            setSelectedAlbum(null);
        }
        setError('');
        setSuccess('');
        setValidationErrors({});
    }, [photoData, allAlbums, albumOptions]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
            setError('');
        } else {
            setFile(null);
            setImagePreview(photoData?.picture && photoData?.aseotitle ? `http://localhost:3001/api/images/${photoData.aseotitle}/${photoData.picture}` : null);
        }
    };

    const handleClearFile = () => {
        setFile(null);
        setImagePreview(photoData?.picture && photoData?.aseotitle ? `http://localhost:3001/api/images/${photoData.aseotitle}/${photoData.picture}` : null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        setError('');
        setIsSubmitting(true);

        const errors = {};
        if (!title.trim()) errors.title = 'Title is required.';
        if (!selectedAlbum) errors.selectedAlbum = 'Album is required.';
        if (!photoData && !file) errors.file = 'Picture is required.'; 

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setIsSubmitting(false);
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content || '');
            formData.append("album_id", selectedAlbum.value);
            formData.append("album_seotitle", selectedAlbum.seotitle);
            formData.append("active", "Y");

            if (file) {
                formData.append("picture", file);
            } else if (photoData?.picture) {
                 formData.append("keep_old_picture", "true");
                 formData.append("picture_filename_old", photoData.picture);
            } else if (photoData && !photoData.picture && !file) {
                formData.append("remove_picture", "true");
            }

            if (photoData) {
                await axios.put(`/api/galleries/${photoData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/api/galleries', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSubmit();
            setSuccess("Photo saved successfully!");
            setTimeout(() => {
            	onClose();
            }, 3000);
        } catch (err) {
            console.error("Save photo error:", err.response?.data || err.message);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save photo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal fade" id="photoModal" ref={modalRef} tabIndex="-1" aria-labelledby="photoModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="photoModalLabel">
                            {photoData ? 'Update Photo' : 'Add New Photo'}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        {success && <div className="alert alert-success" role="alert">{success}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {validationErrors.title && <div className="invalid-feedback">{validationErrors.title}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="album" className="form-label">Album</label>
                                <Select
                                    id="album"
                                    options={albumOptions}
                                    value={selectedAlbum}
                                    onChange={setSelectedAlbum}
                                    placeholder="-- Select Album --"
                                    className={validationErrors.selectedAlbum ? 'is-invalid' : ''}
                                />
                                {validationErrors.selectedAlbum && <div className="text-danger mt-1">{validationErrors.selectedAlbum}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    rows="3"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="picture" className="form-label">Picture</label>
                                <input
                                    type="file"
                                    className={`form-control ${validationErrors.file ? 'is-invalid' : ''}`}
                                    id="picture"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                                {validationErrors.file && <div className="invalid-feedback">{validationErrors.file}</div>}
                            </div>
                            {imagePreview && (
                                <div className="mb-3 text-center">
                                    <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '100%', height: 'auto' }} />
                                    <div className="mt-2">
                                        <button type="button" className="btn btn-danger btn-sm" onClick={handleClearFile}>
                                            <i className="bi bi-trash"></i> Remove Image
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="modal-footer px-0 pb-0 pt-3 border-top-0">
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting} data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
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
