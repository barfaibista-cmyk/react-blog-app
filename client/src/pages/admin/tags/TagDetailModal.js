import React, { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useAuth } from './../../../contexts/AuthContext';

const TagDetailModal = ({ show, onClose, tagData }) => {
	const { hasPermission } = useAuth();
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
            console.warn("TagDetailModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }

        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    return (
        <div className="modal fade" ref={modalRef} id="tagDetailModal" tabIndex="-1" aria-labelledby="tagDetailModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header bg-success">
                        <h5 className="modal-title text-white" id="tagDetailModalLabel">Detail Tag</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    	{
                    		hasPermission('update-tags') ? (
                    			<>
			                        {
				                        tagData ? (
				                            <div className="container-fluid">

				                                <table className="table table-striped table-bordered">
				                                	<tbody>
				                                		<tr>
				                                			<th>Title</th>
				                							<td>{tagData.title}</td>
				                                		</tr>
				 	                                </tbody>
				                            	</table>
				                        	</div>
				                        ) : (
				                            <p className="text-center text-muted">No tag data to show</p>
				                        )
			                        }
		                        </>
	                        ) : (
	                        	<h3>You do not have the right to perform this action.</h3>
	                        )
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagDetailModal;
