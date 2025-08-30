import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useAuth } from './../../../contexts/AuthContext';
import Altcha from './../../../components/Altcha';

const CommentModal = ({ show, onClose, onSuccess, selectedPostId, selectedParentId }) => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentData, setCommentData] = useState({
        name: '',
        email: '',
        content: ''
    });
    const altchaRef = useRef(null);
    const challengeUrl = 'http://localhost:3001/api/altcha/show';
    const verifyUrl = 'http://localhost:3001/api/altcha/spam-filter';
    const [altchaPayload, setAltchaPayload] = useState(null);
    const handleChange = (e) => {
        setCommentData({ ...commentData, [e.target.name]: e.target.value });
    };

    const handleAltchaVerified = (event) => {
    	setAltchaPayload(event.detail.payload);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        if (!altchaPayload) {
             setError('Please solve the verification challenge.');
             setIsSubmitting(false);
             return;
         }

        const payload = {
            post_id: selectedPostId,
            parent: selectedParentId,
            ...commentData,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            altcha: altchaPayload
        };

        try {
            await axios.post('/api/comments/create', payload, {
            	headers: {
            		'Content-Type': 'application/json'
            	}
            });
            setSuccess('Comment has been sent successfully');
            setCommentData({ name: '', email: '', content: '' });
            if (altchaRef.current && typeof altchaRef.current.reset === 'function') {
                 altchaRef.current.reset();
            }
            setAltchaPayload(null);
            onSuccess();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.messages?.error || 'Failed to send comment');
        } finally {
            setIsSubmitting(false);
        }
    };

	const { hasPermission } = useAuth();
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const currentModalElement = modalRef.current;
        if (!currentModalElement) return;

        if (!bsModalInstance.current) {
            bsModalInstance.current = new Modal(currentModalElement);
            console.log("Bootstrap Modal instance created successfully (CommentModal).");
        }

        const myModal = bsModalInstance.current;
        const handleHidden = () => {
            onClose();
            setFormError('');
            setIsSubmitting(false);
        };

        currentModalElement.addEventListener('hidden.bs.modal', handleHidden);
        return () => {
            currentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
            if (myModal) {
                myModal.dispose();
                bsModalInstance.current = null;
                console.log("Bootstrap Modal instance disposed (CommentModal).");
            }
        };
    }, [onClose]);

    useEffect(() => {
        if (!bsModalInstance.current) {
            console.warn("CommentModal: Cannot control visibility, Bootstrap Modal instance not ready.");
            return;
        }

        if (show) {
            bsModalInstance.current.show();
        } else {
            bsModalInstance.current.hide();
        }
    }, [show]);

    return (
        <div className="modal fade" ref={modalRef} id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" data-bs-show="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="commentModalLabel">
                            Reply Comment
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    	{
                    		hasPermission('update-comments') ? (
								<section id="comment-form" className="comment-form section">
			                 		<div className="container-fluid">
			                            <h4>Post Reply</h4>
			                            {formError && <p className="text-danger text-center">{error}</p>}
			                            {success && <p className="text-success text-center">{success}</p>}
										<p>Your email address will not be published. Required fields are marked *</p>
			                            <form onSubmit={handleComment} id="form-comment">
			                                <div className="row">
			                                    <div className="col-md-6 form-group mb-3">
			                                        <input name="name" type="text" className="form-control" placeholder="Your Name*" value={commentData.name} onChange={handleChange} />
			                                    </div>
			                                    <div className="col-md-6 form-group mb-3">
			                                        <input name="email" type="text" className="form-control" placeholder="Your Email*" value={commentData.email} onChange={handleChange} />
			                                    </div>
			                                </div>
			                                <div className="form-group mb-3">
			                                    <textarea name="content" className="form-control" placeholder="Your Comment*" value={commentData.content} onChange={handleChange} />
			                                </div>
			                                <div className="my-3 d-flex justify-content-center">
			                                    <Altcha onVerified={handleAltchaVerified} ref={altchaRef} challengeUrl={challengeUrl} style={{ '--altcha-max-width': '100%'}} verifyUrl={verifyUrl} />
			                                </div>
			                                <div className="text-center">
			                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Post Comment'}</button>
			                                </div>
			                            </form>
			                        </div>
		                        </section>
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

export default CommentModal;
