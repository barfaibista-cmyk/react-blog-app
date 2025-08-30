import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import Select from 'react-select';

const AlbumModal = ({ show, onClose, onSubmitAlbum, albumData }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
    const [title, setTitle] = useState('');
    const [seotitle, setSeotitle] = useState('');
    const [status, setStatus] = useState('Y');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

	const statusOptions = [
        { value: 'Y', label: 'Active'}, 
        { value: 'N', label: 'Inactive' }
    ];
    const selectedStatus = statusOptions.find(option => option.value === status);

	useEffect(() => {
        if (albumData) {
            setTitle(albumData.atitle);
            setSeotitle(albumData.aseotitle);
            setStatus(albumData.active);
        } else {
            setTitle('');
            setSeotitle('');
            setStatus('Y'); 
        }
        setError('');
        setIsSubmitting(false);
    }, [albumData]);

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Modal instance created successfully (AlbumModal).");
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
            setTitle('');
            setSeotitle('');
            setStatus('');
            setError('');
            setIsSubmitting(false);
        };

        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
                console.log("Bootstrap Modal instance disposed (AlbumModal).");
            }
        };
    }, [onClose]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("AlbumModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }
        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    useEffect(() => {
    	if (albumData) {
            setTitle(albumData.atitle);
            setSeotitle(albumData.aseotitle);
            setStatus(albumData.active);
        } else {
            setTitle('');
            setSeotitle('');
            setStatus('');
        }
        setError('');
    }, [albumData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || !seotitle.trim()) {
            setError('Title & Seotitle album is required.');
            return;
        }
        setIsSubmitting(true);
        onSubmitAlbum({
            id: albumData ? albumData.id : null,
            title,
            seotitle,
            status
        });
    };

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
                        {error && (
                            <div className="alert alert-danger" role="alert">{error}</div>
                        )}
                        <form onSubmit={handleSubmit}>
							<div className="mb-3">
                                <label htmlFor="albumStatus" className="form-label">Status</label>
                                <Select
                                    id="status"
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={(selectedOption) => setStatus(selectedOption ? selectedOption.value : '')}
                                    isDisabled={isSubmitting}
                                    placeholder="-- Select Status --"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="albumTitle" className="form-label">Album Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="albumSeotitle" className="form-label">Seotitle</label>
                                <input
                                    type="text"
                                    id="seotitle"
                                    className="form-control"
                                    value={seotitle}
                                    onChange={(e) => setSeotitle(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="albumStatus" className="form-label">Status</label>
                                <Select
                                    id="status"
                                    options={[{value: 'Y', label: 'Active'}, { value: 'N', label: 'Inactive' }]}
                                    disabled={isSubmitting}
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
