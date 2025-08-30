import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import Select from 'react-select';

const AlbumModal = ({ show, onClose, onSubmitAlbum, albumData }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
    const [title, setTitle] = useState('');
    const [seotitle, setSeotitle] = useState('');
    const [status, setStatus] = useState(''); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = [
        { value: 'Y', label: 'Active' }, 
        { value: 'N', label: 'Inactive' }
    ];
    
    useEffect(() => {
        if (albumData) {
            setTitle(albumData.title);
            setSeotitle(albumData.seotitle);
            setStatus(albumData.active);
        } else {
            setTitle('');
            setSeotitle('');
            setStatus(''); 
        }
        setError('');
        setIsSubmitting(false);
    }, [albumData]);

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
            setTitle('');
            setSeotitle('');
            setStatus('Y');
            setError('');
            setIsSubmitting(false);
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
            return;
        }
        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !seotitle.trim()) {
            setError('Title & Seotitle album is required.');
            return;
        }

        setIsSubmitting(true);
        const payload = {
            title,
            seotitle,
            status,
        };

        try {
            if (albumData) {
                await axios.put(`/api/albums/${albumData.id}`, payload);
                setSuccess('Album has been updated successfully!');
            } else {
                await axios.post("/api/albums", payload);
                setSuccess('Album has been created successfully!');
            }
            onSubmitAlbum();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save album.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const selectedStatus = statusOptions.find(option => option.value === status);

    return (
        <div className="modal fade" ref={modalRef} id="albumModal" tabIndex="-1" aria-labelledby="albumModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header ${albumData ? 'bg-primary' : 'bg-secondary'}`}>
                        <h5 className="modal-title text-white" id="albumModalLabel">
                            {albumData ? 'Edit Album' : 'Add New Album'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                        {success && (<div className="alert alert-success" role="alert">{success}</div>)}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Album Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={'' || title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="seotitle" className="form-label">Seotitle Album</label>
                                <input
                                    type="text"
                                    id="seotitle"
                                    className="form-control"
                                    value={'' || seotitle}
                                    onChange={(e) => setSeotitle(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <Select
                                    id="status"
                                    options={statusOptions}
                                    value={'' || selectedStatus}
                                    onChange={(selectedOption) => setStatus(selectedOption ? selectedOption.value : '')}
                                    isDisabled={isSubmitting}
                                    placeholder="-- Select Status --"
                                />
                            </div>
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
                                    {isSubmitting ? 'Saving...' : (albumData ? 'Update Album' : 'Add Album')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumModal;
