import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';
import Spinner from './../../../components/dashboard/Spinner';
import { useAuth } from './../../../contexts/AuthContext';

export default function Write() {
	const { hasPermission } = useAuth();
	const location = useLocation();
	const state = location.state;

	const [title, setTitle] = useState(state?.title || '');
	const [seotitle, setSeotitle] = useState(state?.seotitle || '');
	const [content, setContent] = useState(state?.content || '');
	const [meta_description, setMeta_description] = useState(state?.meta_description || '');
	const [picture_description, setPicture_description] = useState(state?.picture_description || '');
	const [category_id, setCategory_id] = useState(state?.cid || '');
	const [tag, setTag] = useState(state?.tag || []);
	const [headline, setHeadline] = useState(state?.headline || '');
	const [active, setActive] = useState(state?.active || '');
	const [comment, setComment] = useState(state?.comment || '');
	const [type, setType] = useState(state?.type || '');

	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(true);

	const [categories, setCategories] = useState([]);
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const resp = await axios.get('/api/categories');
				setCategories(resp.data);
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchCategories();
	},[]);

	const categoryOptions = categories.map(category => ({ value: category.id, label: category.title }));
	const tagsOptions = state?.tag.split(',').reduce((acc, tag) => {
	    acc.push({
	        value: tag,
	        label: tag
	    });
	    return acc;
	}, []);

	const [file, setFile] = useState(null);
	const upload = async () => {
	    try {
	        const formData = new FormData();
	        formData.append("file", file);
	        const res = await axios.post("/api/galleries", formData, {
	        	headers: {
	        		'Content-Type' : 'multipart/form-ocdata'
	        	}
	        });
	        return res.data;
	    } catch (err) {
	        console.log(err);
			setError(err.message);
	    }
	};

	const navigate = useNavigate();
	const handlePublish = async (e) => {
	    e.preventDefault();
	    const imgUrl = await upload();

	    try {
	        let resp;
	        if (state) {
	            resp = await axios.put(`/api/posts/${state.id}`, {
	                title,
	                seotitle,
	                content,
	                meta_description,
	                imageUrl: imgUrl,
					picture_description,
	                tag,
					headline,
					active,
					comment,
					type
	            });
	        } else {
	            resp = await axios.post(`/api/posts/`, {
	                title,
	                seotitle,
	                content,
	                meta_description,
	                imageUrl: imgUrl,
	                picture_description,
	                tag,
	                headline,
	                active,
	                comment,
	                type,
	                created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
	            });
	        }

	        if (resp.status === 200 || resp.status === 201) {
				setSuccess(resp.message);
				setTimeout(() => {
	            	navigate("/dashboard/posts");
				}, 3000);
	        } else {
	            console.error("API call failed with status:", resp.status);
				setError(resp.responseText);
	        }
	    } catch (err) {
	        console.error("An error occurred:", err);
	        setError(err.message || "Failed for processing the request.");
	    }
	};

	const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
	const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setFile(null);
            setImagePreviewUrl(null);
        }
    };

    const editorRef = useRef(null);
	const toolbars = {
		height: 500,
		menubar: false,
		plugins: [
			'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
			'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
			'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
		],
		toolbar: 'undo redo | blocks | ' +
			'bold italic forecolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | help',
		content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
	}

	if(loading) return <Spinner />
	if(hasPermission('create-posts') || hasPermission('update-posts')) {
		return (
			<main className="main">
		  		<Breadcrumb />
				<section id="starter-section" className="starter-section section">
				    <div className="container-fluid">

			    		<article className="article">
				    		<Link to="/dashboard/posts" className="mb-5 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>

				    		{error && (
								<div className="alert alert-danger" role="alert">{error}</div>
				    		)}
				    		{success && (
								<div className="alert alert-success" role="alert">{success}</div>
				    		)}
				    		<div className="row">
					    		<div className="col-md-8">
							    	<div className="form-group mb-3">
									    <label htmlFor="title" className="form-label">Post Title</label>
									    <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
									</div>
							    	<div className="form-group mb-3">
									    <label htmlFor="seotitle" className="form-label">SEO Title</label>
									    <input type="text" className="form-control" id="seotitle" value={seotitle} onChange={(e) => setSeotitle(e.target.value)}/>
									</div>
									<div className="form-group mb-3">
									    <label htmlFor="content" className="form-label">Post Content</label>
										<div className="editorContainer">
											<Editor
									            apiKey={`${process.env.REACT_APP_EDITOR}`}
									            onInit={(_evt, editor) => editorRef.current = editor}
									            initialValue={state?.content || ((e) => setContent(e.target.value))}
									            init={toolbars}
									        />
										</div>
									</div>

									<div className="form-group mb-3">
									    <label htmlFor="meta_description" className="form-label">Meta Description</label>
									    <textarea className="form-control" id="meta_description" rows="3" value={meta_description} onChange={(e) => setMeta_description(e.target.value)} />
									</div>
									<div className="form-group mb-3">
									    <label htmlFor="picture_description" className="form-label">Picture Description</label>
									    <textarea className="form-control" id="picture_description" rows="3" value={picture_description} onChange={(e) => setPicture_description(e.target.value)} />
									</div>
					    		</div>

					    		<div className="col-md-4">
					    			<div className="form-group mb-3">
									    <label htmlFor="category" className="form-label">Category</label>
									    <Select
									    	id="category"
									        options={categoryOptions}
									        onChange={(selectedOption) => setCategory_id(selectedOption ? selectedOption.value : null)}
									        value={categoryOptions.find(option => option.value === category_id) || null}
									        placeholder="-- Select Category --"
									        isClearable
									    />
									</div>

	 								<div className="form-group mb-3">
									    <label htmlFor="tag" className="form-label">Tag</label>
									    {
									    	state?.tag ? (
												<Select
													id="tag"
													options={tagsOptions}
													isClearable
													isMulti
													defaultValue={tagsOptions}
													onChange={(selectedOptions) => {
									                    const selectedValues = selectedOptions.map(option => option.value);
									                    setTag(selectedValues);
									                }}
													placeholder="-- Select Tag --"
												/>
									    	) : (
									    		<CreatableSelect
									    			id="tag"
									    			isClearable
									    			isMulti
									    			onChange={(selectedOptions) => setTag(selectedOptions ? selectedOptions.value : null)} placeholder="-- Select Tag --" />
								    		)
							    		}
									</div>

									<div className="form-group mb-3">
									    <label htmlFor="headline" className="form-label">Headline</label>
									    <Select
									    	id="headline"
									    	options={[
												{ value: 'Y', label: 'Yes, It\'s headline' },
												{ value: 'N', label: 'No, It isn\'t headline' }
											]}
									    	onChange={(selectedOptions) => setHeadline(selectedOptions ? selectedOptions.value : null)}
									    	placeholder="--Select Headline --"
								    	/>
		 							</div>

									<div className="form-group mb-3">
									    <label htmlFor="active" className="form-label">Active</label>
									    <Select
									    	id="active"
									    	options={[
												{ value: 'Y', label: 'Yes, It\'s active' },
												{ value: 'N', label: 'No, It isn\'t active' }
											]}
									    	onChange={(selectedOptions) => setActive(selectedOptions ? selectedOptions.value : null)}
									    	placeholder="--Select Active --"
								    	/>
									</div>

									<div className="form-group mb-3">
									    <label htmlFor="type" className="form-label">Type</label>
									    <Select
									    	id="type"
									    	options={[
												{ value: 'general', label: 'General' },
												{ value: 'pagination', label: 'Pagination' },
												{ value: 'picture', label: 'Picture' },
												{ value: 'video', label: 'Video' }
											]}
									    	onChange={(selectedOptions) => setType(selectedOptions ? selectedOptions.value : null)}
									    	placeholder="--Select Type --"
								    	/>
									</div>

									<div className="form-group mb-3">
									    <label htmlFor="comment" className="form-label">Comment</label>
									    <Select
									    	id="comment"
									    	options={[
												{ value: 'Y', label: 'Yes, allow to comment' },
												{ value: 'N', label: 'No, disallow to comment' }
											]}
									    	onChange={(selectedOptions) => setComment(selectedOptions ? selectedOptions.value : null)}
									    	placeholder="--Select Comment --"
								    	/>
									</div>

									<div className="form-group mb-3">
									    <label htmlFor="picture" className="form-label">Post Picture</label>
									    <input className="form-control" type={state?.picture ? 'text' : 'file'} id="picture" name="picture" value={state?.picture} onChange={handleImageChange} />
									</div>

									{imagePreviewUrl || state?.picture ? (
		                                <div className="mt-3 text-center">
		                                    <img src={state?.picture === 'default-150x150.png' ? `${window.location.origin}/img/default-150x150.png` : `../../../upload/${state?.picture}`} alt="Preview" className="img-thumbnail" />
		                                </div>
		                            ) : null}

					    		</div>
					    	</div>

							<div className="my-3">
					    		<button type="button" className="text-white btn btn-primary" onClick={handlePublish}><i className="bi bi-send"></i> Publish</button>
				    		</div>
			    		</article>
				    </div>

				</section>
			</main>
		)
	} else {
		return <Navigate to="/unauthorized" replace={true} />
	}
}
