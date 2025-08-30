import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

const PermissionModal = ({ show, onClose, onSubmit, permissionData }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('Y');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Modal instance created successfully (PermissionModal).");
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
            setName('');
            setDescription('');
            setFormError('');
            setIsSubmitting(false);
        };

        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
                console.log("Bootstrap Modal instance disposed (PermissionModal).");
            }
        };
    }, [onClose]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("PermissionModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }

        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    useEffect(() => {
    	if (permissionData) {
            setName(permissionData.name);
            setDescription(permissionData.description);
        } else {
            setName('');
            setDescription('');
        }
        setFormError('');
    }, [permissionData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            setFormError('Permission name is required.');
            return;
        }

        setIsSubmitting(true);
        onSubmit({
            id: permissionData ? permissionData.id : null,
            name,
            description
        });
    };

    return (
        <div className="modal fade" ref={modalRef} id="permissionModal" tabIndex="-1" aria-labelledby="permissionModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header ${permissionData ? 'bg-primary' : 'bg-secondary'}`}>
                        <h5 className="modal-title text-white" id="permissionModalLabel">
                            {permissionData ? 'Edit Permission' : 'Add New Permission'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {formError && (
                            <div className="alert alert-danger" role="alert">
                                {formError}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="permissions" className="form-label">
                                    Permission Name
                                </label>
                                <input type="text" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="permissions" className="form-label">
                                    Permission Description
                                </label>
                                <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="modal-footer px-0 pb-0 pt-3 border-top-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    data-bs-dismiss="modal"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : (permissionData ? 'Update Permission' : 'Add Permission')}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionModal;
