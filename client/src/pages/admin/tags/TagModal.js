import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal } from 'bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useAuth } from './../../../contexts/AuthContext';

const TagModal = ({ show, onClose, onSubmit, tagData, allTags }) => {
	const { hasPermission } = useAuth();
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
	const [selectedOptions, setSelectedOptions] = useState([]);
    const [formData, setFormData] = useState({
    	title: [],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

	const tagsOptions = useMemo(() => {
		if (!allTags) return [];
        return allTags.map(tag => ({
            value: tag.seotitle,
            label: tag.title,
        }));
	},[allTags]);

	useEffect(() => {
		if (tagData) {
            const initialOptions = tagData?.title?.map(title => ({
                value: title,
                label: title,
            }));
            setSelectedOptions(initialOptions);
        } else {
            setSelectedOptions([]);
        }
	},[tagData])

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Modal instance created successfully (TagModal).");
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
            setFormData({ title: [] });
            setError('');
            setIsSubmitting(false);
            setSuccess('');
        };
        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
                console.log("Bootstrap Modal instance disposed (TagModal).");
            }
        };
    }, [onClose, tagData]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("TagModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }

        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

	const handleSelectChange = (selected) => {
        setSelectedOptions(selected);
        const titles = selected ? selected.map(option => option.value) : [];
        setFormData({ ...formData, title: titles });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
		setSuccess('');
        setIsSubmitting(true);
        try {
	        if(tagData) {
	        	await axios.put(`/api/tags/${tagData.seotitle}`, formData);
	        	setSuccess('Tag has been updated successfully!');
	        } else {
	        	await axios.post('/api/tags', formData);
	        	setSuccess('Tag has been created successfully!');
	        }
	        setTimeout(() => {
				bsModalInstance.current.hide();
	        }, 3000);
        } catch(err) {
        	console.error(err);
			setError(err.response?.data?.message || err.message || 'An error occurred.')
			bsModalInstance.current.hide();
        } finally {
        	setIsSubmitting(false);
        }
    };

    return (
        <div className="modal fade" ref={modalRef} id="tagModal" tabIndex="-1" aria-labelledby="tagModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header ${tagData ? 'bg-primary' : 'bg-secondary'}`}>
                        <h5 className="modal-title text-white" id="tagModalLabel">
                            {tagData ? 'Edit Tag' : 'Add New Tag'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    	{
                    		hasPermission('update-tags') || hasPermission('create-tags') ? (
                    			<>
			                        {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
			                        {success && (<div className="alert alert-success" role="alert">{success}</div>)}

			                        <form onSubmit={handleSubmit}>
			                            <div className="mb-3">
										    <label htmlFor="tag" className="form-label">Tag</label>

										    {
										    	tagData?.title ? (
													<Select
														id="tag"
														options={tagsOptions}
														value={selectedOptions}
														onChange={handleSelectChange}
														placeholder="-- Select Tag --"
														isClearable
														isMulti
													/>
										    	) : (
										    		<CreatableSelect
										    			id="tag"
										    			isClearable
										    			isMulti
														value={selectedOptions}
														onChange={handleSelectChange}
														placeholder="-- Select Tag --"
													/>
									    		)
								    		}
			                            </div>
			                            <div className="modal-footer px-0 pb-0 pt-3 border-top-0">
			                                <button
			                                    type="submit"
			                                    className="btn btn-primary"
			                                    disabled={isSubmitting}
			                                >
			                                    {isSubmitting ? 'Saving...' : (tagData ? 'Update Tag' : 'Add New Tag')}
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

export default TagModal;
