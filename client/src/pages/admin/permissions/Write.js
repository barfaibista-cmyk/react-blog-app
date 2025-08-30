import axios from 'axios';
import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Choices from "choices.js";
import 'choices.js/public/assets/styles/choices.min.css';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Breadcrumb from './../../../components/dashboard/Breadcrumb';

export default function Write() {
	useLayoutEffect(() => {
		document.body.classList.remove('login-page');
		document.body.classList.remove('bg-body-secondary');
	},[])

	const state = useLocation().state;
	const [title, setTitle] = useState(state?.ptitle || '');
	const [seotitle, setSeotitle] = useState(state?.pseotitle || '');
	const [content, setContent] = useState(state?.content || '');
	const [meta_description, setMeta_description] = useState(state?.meta_description || '');
	const [picture_description, setPicture_description] = useState(state?.picture_description || '');
	const [category_id, setCategory_id] = useState(state?.cid || '');
	const [tag, setTag] = useState(state?.tag || []);
	const [headline, setHeadline] = useState(state?.headline || '');
	const [active, setActive] = useState(state?.pactive || '');
	const [comment, setComment] = useState(state?.comment || '');
	const [type, setType] = useState(state?.type || '');

	const [categories, setCategories] = useState([]);
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const resp = await axios.get('/api/categories');
				setCategories(resp.data);
			} catch (err) {
				console.error(err);
			}
		}
		fetchCategories();
	},[categories]);

	const categoryRef = useRef(null);
	useEffect(() => {
		if(categoryRef.current) {
			const instance = new Choices(categoryRef.current, {
				searchEnabled: true,
				placeholder: true,
				placeholderValue: '-- Select category --',
			});
			return () => {
            	instance?.destroy();
            };
		}
	},[])

	const tagRef = useRef(null);
	useEffect(() => {
		if(tagRef.current) {
			const instance = new Choices(tagRef.current, {
				searchEnabled: false,
				placeholder: state?.tag ? false : true,
				placeholderValue: state?.tag ? null : '-- Select tag --',
	            maxItemCount: 5,
	            delimiter: ',',
	            editItems: true,
	            allowHTML: true,
	            removeItemButton: true,
	            duplicateItemsAllowed: false,
	            addItemText: (value, rawValue) => {
			        return `Press Enter to add <b>"${value}"</b>`;
			    },
			});
			const tagArray = state?.tag?.split(',').map((t, i) => t.trim());
			if(state?.tag !== undefined && tag && tag.length > 0) {
				instance.setValue(tagArray);
			}
			return () => {
            	instance?.destroy();
            };
		}
	},[tag, state?.tag])

	const headlineRef = useRef(null);
	useEffect(() => {
		if(headlineRef.current) {
			const instance = new Choices(headlineRef.current, {
				searchEnabled: false,
				placeholder: true,
				placeholderValue: '-- Is is headline? --',
			});
			return () => {
            	instance?.destroy();
            };
		}
	},[])

	const activeRef = useRef(null);
	useEffect(() => {
		if(activeRef.current) {
			const instance = new Choices(activeRef.current, {
				searchEnabled: false,
				placeholder: true,
				placeholderValue: '-- Is it active? --'
			});
			return () => {
            	instance?.destroy();
            };
		}
	},[])

	const typeRef = useRef(null);
	useEffect(() => {
		if(typeRef.current) {
			const instance = new Choices(typeRef.current, {
				searchEnabled: false,
				placeholder: true,
				placeholderValue: '-- What is it post type? --'
			});
			return () => {
            	instance?.destroy();
            };
		}
	},[])

	const commentRef = useRef(null);
	useEffect(() => {
		if(commentRef.current) {
			const instance = new Choices(commentRef.current, {
				searchEnabled: false,
				placeholder: true,
				placeholderValue: '-- Allow comment? --'
			});
			return () => {
            	instance?.destroy();
            };
		}
	},[])

	const [file, setFile] = useState(null);
	const upload = async () => {
	    try {
	        const formData = new FormData();
	        formData.append("file", file);
	        const res = await axios.post("/api/galleries/upload", formData);
	        return res.data;
	    } catch (err) {
	        console.log(err);
	    }
	};
	const navigate = useNavigate();
	const handlePublish = async (e) => {
		e.preventDefault();
		const imgUrl = await upload();

		try {
		    state
		    ? await axios.put(`/api/posts/${state.id}`, {
	        	title, seotitle, content, meta_description, category_id, tag, picture: file ? imgUrl: "", picture_description, headline, active, comment, type
		    })
		    : await axios.post(`/api/posts/`, {
	        	title, seotitle, content, meta_description, category_id, tag, picture: file ? imgUrl: "", picture_description, headline, active, comment, type, created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
		    });
		    navigate("/")
		} catch (err) {
		    console.error(err);
		}
	}

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

	return (
		<main className="main">
	  		<Breadcrumb />
			<section id="starter-section" className="starter-section section">
			    <div className="container-fluid">

		    		<Link to="/dashboard/posts" className="my-3 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>

		    		<div className="row">
			    		<div className="col-md-8">
					    	<div className="form-group mb-3">
							    <label htmlFor="title" className="form-label">Post Title</label>
							    <input type="text" className="form-control" id="title" value={state?.ptitle} onChange={(e) => setTitle(e.target.value)} />
							</div>
					    	<div className="form-group mb-3">
							    <label htmlFor="seotitle" className="form-label">SEO Title</label>
							    <input type="text" className="form-control" id="seotitle" value={state?.pseotitle} onChange={(e) => setSeotitle(e.target.value)}/>
							</div>
							<div className="form-group mb-3">
							    <label htmlFor="content" className="form-label">Post Content</label>
							    <div className="editorContainer">
								    <ReactQuill
								        className="editor"
								        theme="snow"
								        value={content}
								        onChange={setContent}
								    />
								</div>
							</div>
							<div className="form-group mb-3">
							    <label htmlFor="meta_description" className="form-label">Meta Description</label>
							    <textarea className="form-control" id="meta_description" rows="3" value={state?.meta_description} onChange={(e) => setMeta_description(e.target.value)} />
							</div>
							<div className="form-group mb-3">
							    <label htmlFor="picture_description" className="form-label">Picture Description</label>
							    <textarea className="form-control" id="picture_description" rows="3" value={state?.picture_description} onChange={(e) => setPicture_description(e.target.value)} />
							</div>
			    		</div>

			    		<div className="col-md-4">
			    			<div className="form-group mb-3">
							    <label htmlFor="category" className="form-label">Category</label>
								<select id="category" defaultValue={state?.ctitle} onChange={(e) => setCategory_id(e.target.selected)} ref={categoryRef} className="form-select">
								    {
								    	state?.ctitle ? (
											<>
												<option value={state?.ctitle} selected={state?.ctitle ? true : null}>{state?.ctitle}</option>
												{
													categories.map((category, idx) => (
														<option key={idx} value={category.id}>{category.title}</option>
													))
												}
											</>
										) : (
											<>
												{
													categories.map((category, idx) => (
														<option key={idx} value={category.id}>{category.title}</option>
													))
												}
											</>
										)
									}
								</select>
							</div>

							<div className="form-group mb-3">
							    <label htmlFor="tag" className="form-label">Tag</label>
								<select id="tag" className="form-select" ref={tagRef} defaultValue={tag} onChange={(e) => setTag(e.target.value)} multiple={true}>
									<option value=""></option>
								</select>
							</div>

							<div className="form-group mb-3">
							    <label htmlFor="headline" className="form-label">Headline</label>
								<select id="headline" defaultValue={state?.headline} onChange={(e) => setHeadline(e.target.selected)} ref={headlineRef} className="form-select">
								    {
								    	state?.headline ? (
											<>
											    <option value="Y">Yes, It's headline</option>
											    <option value="N">No, It isn't headline</option>
											</>
										) : (
											<option value={state?.headline} selected={state?.headline === 'Y' ? true : null}>{state?.headline === 'Y' ? 'Yes, It\'s headline' : 'No, It isn\'t headline'}</option>
										)
									}
								</select>
 							</div>

							<div className="form-group mb-3">
							    <label htmlFor="active" className="form-label">Active</label>
								<select id="active" defaultValue={state?.pactive} onChange={(e) => setActive(e.target.selected)} ref={activeRef} className="form-select">
								    {
										state?.pactive ? (
											<>
											    <option value="Y">Yes, It's Active</option>
											    <option value="N">No, It's Inactive</option>
											</>
										) : (
											<option value={state?.pactive} selected={state?.pactive === 'Y' ? true : null}>{state?.pactive === 'Y' ? 'Aative' : 'Inactive'}</option>
										)
									}
								</select>
							</div>

							<div className="form-group mb-3">
							    <label htmlFor="type" className="form-label">Type</label>
								<select id="type" defaultValue={state?.type} onChange={(e) => setType(e.target.selected)} ref={typeRef} className="form-select">
									{
										state?.type ? (
											<>
											    <option value="general">General</option>
											    <option value="pagination">Pagination</option>
											    <option value="picture">Picture</option>
											    <option value="video">Video</option>
											</>
										) : (
										    <option value={state?.type} selected={true}>{state?.type}</option>
									    )
									}
								</select>
							</div>

							<div className="form-group mb-3">
							    <label htmlFor="comment" className="form-label">Comment</label>
								<select id="comment" defaultValue={state?.comment} onChange={(e) => setComment(e.target.selected)} ref={commentRef} className="form-select">
									{
										state?.comment ? (
											<>
											    <option value="Y">Yes, It's Allow</option>
											    <option value="N">No, It's Disallow</option>
											</>
										) : (
											<option value={state?.comment} selected={state?.comment === 'Y' ? true : null}>{state?.comment === 'Y' ? 'Yes, It\'s Allow' : 'No, It\'s Disallow'}</option>
										)
									}
								</select>
							</div>

							<div className="form-group mb-3">
							    <label htmlFor="picture" className="form-label">Post Picture</label>
							    <input className="form-control" type={state?.ppicture ? 'text' : 'file'} id="picture" name="picture" value={state?.ppicture} onChange={handleImageChange} />
							</div>

							{imagePreviewUrl || state?.ppicture ? (
                                <div className="mt-3 text-center">
                                    <img src={state?.ppicture === 'default-150x150.png' ? `${window.location.origin}/img/default-150x150.png` : `../../upload/${state?.ppicture}`} alt="Preview" className="img-thumbnail" />
                                </div>
                            ) : null}

			    		</div>
			    	</div>
					<div className="float-end my-3">
			    		<button type="button" className="text-white btn btn-primary" onClick={handlePublish}><i className="bi bi-send"></i> Publish</button>
		    		</div>
			    </div>

			</section>
		</main>
	)
}
