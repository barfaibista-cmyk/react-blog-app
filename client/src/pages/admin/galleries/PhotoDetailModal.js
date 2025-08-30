import React, { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

const PhotoDetailModal = ({ show, onClose, photoData }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Detail Modal instance created successfully.");
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
                console.log("Bootstrap Detail Modal instance disposed.");
            }
        };
    }, [onClose]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("PhotoDetailModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }

        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    return (
        <div className="modal fade" ref={modalRef} id="photoDetailModal" tabIndex="-1" aria-labelledby="photoDetailModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header bg-success">
                        <h5 className="modal-title text-white" id="photoDetailModalLabel">Detail Photo</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {photoData ? (
                            <div className="container-fluid">
                                {photoData.picture && (
                                	<img
                                		src={`http://localhost:3001/api/images/${photoData?.aseotitle}/${photoData?.picture}`}
	                                    alt={photoData.ptitle || 'Pratinjau photo'}
	                                    className="img-fluid rounded"
	                                    style={{ maxWidth: '420px', height: 'auto', margin: '16px 0' }}
	                                    onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:3001/api/images/default-150x150.png'; }}
	                                />
                                )}
                                <table className="table table-striped table-bordered">
                                	<tbody>
		                                <tr>
		                                    <th>ID Photo</th>
		                                    <td>{photoData.aid}</td>
		                                </tr>
		                                <tr>
		                                    <th>Photo Title</th>
		                                    <td>{photoData.atitle}</td>
		                                </tr>
		                                <tr>
		                                    <th>SEO Title (Slug)</th>
		                                    <td>{photoData.aseotitle}</td>
		                                </tr>
		                                <tr>
		                                    <th>Active Status</th>
		                                    <td>{photoData.active === 'Y' ? 'Active' : 'Inactive'}</td>
		                                </tr>
		                                <tr>
		                                    <th>Created By</th>
		                                    <td>{photoData.name}</td>
		                                </tr>
		                                <tr>
		                                    <th>Created At</th>
		                                    <td>{new Date(photoData.created_at).toLocaleString()}</td>
		                                </tr>
		                                <tr>
		                                    <th>Picture Name</th>
		                                    <td>{photoData.picture || '-'}</td>
		                                </tr>
	                                </tbody>
                            	</table>
                        	</div>
                        ) : (
                            <p className="text-center text-muted">No photo data to show.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoDetailModal;
