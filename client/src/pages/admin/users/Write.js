import axios from 'axios';
import { useState, useRef } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import moment from 'moment';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import { useAuth } from './../../../contexts/AuthContext';

export default function Write() {
	const state = useLocation().state;
	const { hasPermission } = useAuth();
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [name, setName] = useState(state?.name || '');
	const [username, setUsername] = useState(state?.username || '');
	const [email, setEmail] = useState(state?.email || '');
	const [telp, setTelp] = useState(state?.telp || '');
	const [bio, setBio] = useState(state?.bio || '');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [file, setFile] = useState(null);
	const fileInputRef = useRef(null);
	const triggerFileInput = () => {
		if(fileInputRef.current) {
			fileInputRef.current.click();
		}
	}
	const [validationErrors, setValidationErrors] = useState({});
	const [imagePreview, setImagePreview] = useState(
		state?.picture ? `/upload/${state?.picture}` : null
	);
	const handleImageChange = (evt) => {
        const selectedFile = evt.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
        	setFile(null);
			setImagePreview(state?.picture ? `/upload/${state.picture}` : null);
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

	const validateForm = () => {
        const errors = {};
        if (!name.trim()) {
            errors.name = 'Name is required.';
        }
        if (!username.trim()) {
            errors.username = 'Username is required.';
        }
        if (!email.trim()) {
            errors.email = 'Email is required.';
        }
		if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Email is invalid.';
		}
        if (file) {
            const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!acceptedImageTypes.includes(file.type)) {
                errors.picture = 'The file must be an image (jpeg, png, gif, atau webp).';
			}
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
        setSuccess('');
       	setIsSubmitting(true);

        if (!validateForm()) {
            return;
        }

		let imgUrl = state?.picture || '';
		if(file) {
			imgUrl = await upload(file);
			console.log(imgUrl);
			if (!imgUrl) {
                setIsSubmitting(false);
                return;
            }
		}

		try {
		    if(state) {
		    	await axios.put(`/api/users/${state?.id}`, {
			    	name,
			    	username,
			    	email,
			    	telp,
			    	bio,
		        	picture: imgUrl, 
		        	updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
			    });
		    	setSuccess('User has been updated successfully');
		    } else {
			    await axios.post(`/api/users`, {
			    	name,
			    	username,
			    	email,
			    	telp,
			    	bio,
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

    if(hasPermission('create-users') || hasPermission('update-users')) {
		return (
			<main className="main">
		  		<Breadcrumb />
				<section id="starter-section" className="starter-section section">
				    <div className="container-fluid">

			    		<article className="article">
			    			<Link to="/dashboard/users" className="mb-3 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>
			    			{error && (<div className="alert alert-danger" role="alert">{error}</div>)}
			    			{success && (<div className="alert alert-success" role="alert">{success}</div>)}
			    			<form onSubmit={handleSubmit} className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" id="name" className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
                                        {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" id="email" className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                                        {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="bio" className="form-label">Bio</label>
                                        <textarea id="bio" className="form-control" value={bio} onChange={(e) => setBio(e.target.value)} rows="10" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input type="text" id="username" className={`form-control ${validationErrors.username ? 'is-invalid' : ''}`} value={username} onChange={(e) => setUsername(e.target.value)} />
                                        {validationErrors.username && <div className="invalid-feedback">{validationErrors.username}</div>}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="telp" className="form-label">Telp</label>
                                        <input type="text" id="telp" className="form-control" value={telp} onChange={(e) => setTelp(e.target.value)} />
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
                                                Hapus Gambar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="text-white btn btn-primary" disabled={isSubmitting}><i className="bi bi-send"></i> {isSubmitting ? 'Submitting...' : (state ? 'Update' : 'Create') }</button>
					    	</form>

			    		</article>

				    </div>
				</section>
			</main>
		)
	} else {
		return <Navigate to="/unauthorized" replace={true} />
	}
}
