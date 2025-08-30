import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import moment from 'moment';
import Select from 'react-select';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Spinner from './../../../components/dashboard/Spinner';
import { useAuth } from './../../../contexts/AuthContext';

export default function Write() {
	const { hasPermission } = useAuth();
	const state = useLocation().state;
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		parent: state?.parent || '',
		title: state?.title || '',
		seotitle: state?.seotitle || '',
		active: state?.active || '',
	});
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const resp = await axios.get('/api/categories');
				setCategories(resp.data);
				if (state) {
	                setFormData(prevFormData => ({
	                    ...prevFormData,
	                    parent: Number(state.parent) || 0,
	                    active: state.active || 'N'
	                }));
	            }
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchCategories();
	},[state]);

	const categoryOptions = [
		{ value: 0, label: 'No Parent' },
		...categories.map(category => ({ 
			value: Number(category.id), 
			label: category.title 
		}))
	];

	const activeOptions = [
		{ value: 'Y', label: 'Active' },
		{ value: 'N', label: 'Inactive' }
	];
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		const timestampKey = state ? 'updated_at' : 'created_at';
		const dataToSend = {
			...formData,
			[timestampKey]: moment().format("YYYY-MM-DD HH:mm:ss"),
		}
		try {
			if (state) {
				await axios.put(`/api/categories/${state.id}`, dataToSend);
		 		setSuccess('Category updated successfully!');
			} else {
				await axios.post('/api/categories', dataToSend);
				setSuccess('Category created successfully!');
			}
		} catch (err) {
			console.error(err);
			setError(err.response?.data?.message || err.message || 'An error occurred.');
		} finally {
			setIsSubmitting(false);
		}
	}

	if(loading) return <Spinner />
	if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

	if(hasPermission('create-categories') || hasPermission('update-categories')) {
		return (
			<main className="main">
		  		<Breadcrumb />
		  		<section id="starter-section" className="starter-section section">
					<div className="container-fluid">

						<section id="blog-details" className="blog-details section">
					        <div className="container-fluid">

					            <article className="article">
	    							<Link to="/dashboard/categories" className="mb-3 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>

						        	<div className="container-fluid">
						        		{ error && (<div className="alert alert-danger" role="alert">{error}</div>) }
						        		{ success && (<div className="alert alert-success" role="alert">{success}</div>) }
		    							<form onSubmit={handleSubmit}>
		    								<div className="row mb-3">
			    								<div className=" col-6 form-group">
			    									<label htmlFor="parent">Parent</label>
			    									<Select
												    	id="parent"
												        options={categoryOptions}
												        onChange={(selectedOption) => setFormData({...formData, parent: selectedOption ? selectedOption.value : 0 })}
												        value={categoryOptions.find(option => option.value === formData.parent) || null}
												        placeholder="-- Select Category --"
												        isClearable
												    />
			    								</div>
			    								<div className="col-6 form-group">
			    									<label htmlFor="title">Title</label>    									
			    									<input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
			    								</div>
		    								</div>
		    								<div className="row mb-3">
			    								<div className=" col-6 form-group">
			    									<label htmlFor="active">Active</label>
			    									<Select
												    	id="active"
												        options={activeOptions}
												        onChange={(selectedOption) => setFormData({ ...formData, active: selectedOption ? selectedOption.value : null })}
												        value={activeOptions.find(option => option.value === formData.active) || null}
												        placeholder="-- Select Active --"
												    />
			    								</div>
			    								<div className="col-6 form-group">
			    									<label htmlFor="seotitle">SEO Title</label>
			    									<input type="text" className="form-control" value={formData.seotitle} onChange={(e) => setFormData({...formData, seotitle: e.target.value})} />
			    								</div>
		    								</div>
	    								
		    								<button type="submit" className="btn btn-primary" disable={isSubmitting === false ? 'false' : 'true'}><i className="bi bi-send"></i> {isSubmitting ? 'Submitting...' : (state? 'update' : 'Create')}</button>
	    								</form>
	    							</div>

					            </article>
				            </div>
			            </section>
					            
		            </div>
	            </section>
	        </main>
	    )
    } else {
    	return <Navigate to="/unauthorized" replace={true} />
    }
}
