import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useAuth } from './../../../contexts/AuthContext';

const RoleModal = ({ show, onClose, onSubmit, roleData }) => {
	const { hasPermission } = useAuth();
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);

    const [name, setName] = useState('');
    const [status, setStatus] = useState('Y');
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Modal instance created successfully (RoleModal).");
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
            setName('');
            setStatus('');
            setFormError('');
            setIsSubmitting(false);
        };

        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
                console.log("Bootstrap Modal instance disposed (RoleModal).");
            }
        };
    }, [onClose]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("RoleModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }

        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    useEffect(() => {
    	if (roleData) {
            setName(roleData.fullname);
            setStatus(roleData.active);
        } else {
            setName('');
            setStatus('');
        }
        setFormError('');
    }, [roleData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            setFormError('Role name is required.');
            return;
        }

        setIsSubmitting(true);
        onSubmit({
            id: roleData ? roleData.id : null,
            name,
            status
        });
    };

    return (
        <div className="modal fade" ref={modalRef} id="roleModal" tabIndex="-1" aria-labelledby="roleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header ${roleData ? 'bg-primary' : 'bg-secondary'}`}>
                        <h5 className="modal-title text-white" id="roleModalLabel">
                            {roleData ? 'Edit Role' : 'Add New Role'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    	{
                    		hasPermission('update-roles') ? (
                    			<>
			                        {formError && (
			                            <div className="alert alert-danger" role="alert">
			                                {formError}
			                            </div>
			                        )}
			                        <form onSubmit={handleSubmit}>
			                            <div className="mb-3">
			                                <label htmlFor="roleName" className="form-label">
			                                    Full Name
			                                </label>
			                                <input
			                                    type="text"
			                                    id="fullName"
			                                    className="form-control"
			                                    placeholder="Input fullname"
			                                    value={name}
			                                    onChange={(e) => setName(e.target.value)}
			                                    required
			                                    disabled={isSubmitting}
			                                />
			                            </div>
			                            <div className="mb-3">
			                                <label htmlFor="roles" className="form-label">
			                                    Role Name
			                                </label>
			                                <select
			                                    id="roles"
			                                    className="form-select"
			                                    defaultValue={status}
			                                    disabled={isSubmitting}
			                                >
			                                	<option value="">-- Select Role --</option>
			                                </select>
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
			                                    {isSubmitting ? 'Saving...' : (roleData ? 'Update Role' : 'Add Role')}
			                                </button>
			                            </div>
			                        </form>
		                        </>
	                        ) : (
	                        	<h3>You do not have the right to perform this action.</h3>
	                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;
