import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import DOMPurify from "dompurify";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import Altcha from '../components/Altcha';

const Single = () => {
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const commentFormRef = useRef(null);
	const altchaRef = useRef(null);
	const challengeUrl = 'http://localhost:3001/api/altcha/show';
	const verifyUrl = 'http://localhost:3001/api/altcha/spam-filter';
	const [parentCommentId, setParentCommentId] = useState(null);
	const [altchaPayload, setAltchaPayload] = useState(null);

	const [commentData, setCommentData] = useState({
		name: '',
		email: '',
		content: ''
	});

	const location = useLocation();
	const seotitle = location.pathname.split('/')[2];
	
	const [post, setPost] = useState({});
	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			try {
				const resp = await axios.get(`/api/posts/${seotitle}`);
				setPost(resp.data);
			} catch(err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		}
		fetchPost();
	},[seotitle])

	const { id, ctitle, title, picture, content, tag, created_at, username } = post;

	const [comments, setComments] = useState([]);
	useEffect(() => {
		const fetchComments = async () => {
			setLoading(true);
			if(!id) return;
			try {
				const resp = await axios.get(`/api/comments/${id}`);
				setComments(resp.data);
			} catch(err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		}
		fetchComments();
	},[id]);

	const [allPosts, setAllPosts] = useState([]);
	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const resp = await axios.get('/api/posts');
				setAllPosts(resp.data);
			} catch(err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	},[]);

	const currentIndex = allPosts.findIndex(p => p.seotitle === seotitle);
	const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
	const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

	const arrayTag = tag?.split(',') || [];
	const newTag = arrayTag.map((t, i) => (
		<li key={i}>
			<Link to={`/tag/${t}`}>{t}</Link>
		</li>
	));

	const renderComments = (elements, parentId = '0') => {
		const nestedComments = elements.filter(element => String(element.parent) === String(parentId));

		if (nestedComments.length === 0) return null;

		return nestedComments.map(element => (
			<div key={element.id} id={`comment-${element.id}`} className="comment">
				<div className="d-flex">
					<div className="comment-img">
						<img src={`${window.location.origin}/img/default-150x150.png`} alt="" />
					</div>
					<div>
						<h5>
							{element.name}
							<Link to="#" className="reply" onClick={() => {
								setParentCommentId(element.id);
								commentFormRef.current.scrollIntoView({ behavior: 'smooth' });
							}}>
								<i className="bi bi-reply-fill"></i> Reply
							</Link>
						</h5>
						<time dateTime={element.created_at}>{new Date(element.created_at).toLocaleDateString()}</time>
						<p>{element.content}</p>
					</div>
				</div>
				<div id={`comment-reply-${element.id}`} className="comment comment-reply">
					{renderComments(elements, element.id)}
				</div>
			</div>
		));
	};

	const commentsCount = comments.filter(comment => String(comment.post_id) === String(id)).length;

	const handleChange = (e) => {
		setCommentData({...commentData, [e.target.name]: e.target.value});
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

		const commentPayload = {
			post_id: id,
			parent: parentCommentId || '0',
			name: commentData.name,
			email: commentData.email,
			content: commentData.content,
			created_at: new Date().toISOString(),
			altcha: altchaPayload
		};

		try {
			const res = await axios.post('/api/comments/create', commentPayload, {
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (res.status === 201) {
				setSuccess('Comment has been sent successfully');
				setCommentData({ name: '', email: '', content: '' });
				setParentCommentId(null);
				if (altchaRef.current) {
					altchaRef.current.reset();
				}
				const updatedCommentsRes = await axios.get(`/api/comments/${id}`);
				setComments(updatedCommentsRes.data);
			}
		} catch(err) {
			setError('Failed to send comment. Please try again.');
			console.error('Error submitting comment:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	if(loading) return <Spinner />;

	if(error) return (
		<div className="container-fluid mt-5">
			<h3 className="text-center">{error.message}</h3>
		</div>
	);

	if(!post || Object.keys(post).length === 0) return (
		<div className="container-fluid mt-5">
			<h3 className="text-center">No post found with seotitle {seotitle}</h3>
		</div>
	);

	return (
		<>
			<div className="page-title light-background">
				<div className="container">
					<nav className="breadcrumbs">
						<ol>
							<li><Link to="/">Home</Link></li>
							<li><Link to={`/category/${ctitle}`}>{ctitle}</Link></li>
							<li className="current">{title}</li>
						</ol>
					</nav>
					<h1>{title}</h1>
				</div>
			</div>

			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<section id="blog-details" className="blog-details section">
							<div className="container">
								<article key={id} className="article">
									<div className="post-img">
										<img className="card-img-top" src={ picture === 'default-150x150.png' ? `${process.env.REACT_APP_PROXY}/api/images/upload/default-150x150.png` : `${process.env.REACT_APP_PROXY}/api/images/blog/${post.picture}`} alt={post.picture_description} />
									</div>
									<h2 className="title">{title}</h2>
									<div className="meta-top">
										<ul>
											<li className="d-flex align-items-center"><i className="bi bi-person"></i> <Link to="blog-details">{username ? `${username[0].toUpperCase()+username.slice(1)}` : null}</Link></li>
											<li className="d-flex align-items-center"><i className="bi bi-clock"></i> <Link to="blog-details"><time dateTime={created_at}>{new Date(created_at).toLocaleDateString()}</time></Link></li>
										</ul>
									</div>
									<div className="content">
										<p style={{ textAlign: 'justify' }}
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(content),
											}}
										></p>
									</div>
									<div className="meta-bottom">
										<ul className="cats">
											<li><i className="bi bi-folder"></i> <Link to={`/category/${ctitle}`}>{ctitle}</Link></li>
										</ul>
										<ul className="tags">
											{ tag !== '' ? <><i className="bi bi-tags"></i>{' '}{newTag}</> : null }
										</ul>
									</div>
								</article>

								<div className="d-flex justify-content-between mt-3">
									<div>
										{previousPost && (
											<>
												<Link to={`/posts/${previousPost.seotitle}`}>Previous Post</Link>
												<br />
												<div className="text-wrap" style={{ width: '20rem' }}>
													<p>{previousPost.title}</p>
												</div>
											</>
										)}
									</div>
									<div>
										{nextPost && (
											<>
												<Link className="float-end" to={`/posts/${nextPost.seotitle}`}>Next Post</Link>
												<br />
												<div className="text-wrap" style={{ width: '20rem' }}>
													<p className="text-end">{nextPost.title}</p>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						</section>

						<section id="blog-comments" className="blog-comments section">
							<div className="container">
								<h4 className="comments-count">{commentsCount} Comments</h4>
								{
									commentsCount > 0 ? renderComments(comments) : <p>Be the first to leave a comment!</p>
								}
							</div>
						</section>

						<section id="comment-form" className="comment-form section">
							<div className="container">
								<form onSubmit={handleComment} ref={commentFormRef}>
									<h4 className="text-center">Post a Comment</h4>
									<p className="text-center text-muted">Your email address will not be published. Required fields are marked *</p>

									{parentCommentId && (
										<div className="alert alert-info d-flex justify-content-between align-items-center">
											<span>Replying to comment ID: {parentCommentId}</span>
											<button type="button" className="btn-close" onClick={() => setParentCommentId(null)}></button>
										</div>
									)}

									{ error && (
										<div className="alert alert-danger alert-dismissible fade show" role="alert">
											{error}
											<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
										</div>
									)}
									{ success && (
										<div className="alert alert-success alert-dismissible fade show" role="alert">
											{success}
											<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
										</div>
									)}

									<div className="row">
										<div className="col-md-6 form-group">
											<input name="name" type="text" className="form-control" placeholder="Your Name*" value={commentData.name} onChange={handleChange} required />
										</div>
										<div className="col-md-6 form-group">
											<input name="email" type="email" className="form-control" placeholder="Your Email*" value={commentData.email} onChange={handleChange} required />
										</div>
									</div>
									<div className="row">
										<div className="col form-group">
											<textarea name="content" className="form-control" placeholder="Your Comment*" value={commentData.content} onChange={handleChange} required />
										</div>
									</div>

									<div className="mt-3 d-flex justify-content-center">										
										<Altcha onVerified={handleAltchaVerified} ref={altchaRef} challengeUrl={challengeUrl} verifyUrl={verifyUrl}/>
									</div>

									<div className="text-center mt-3">
										<button type="submit" className="btn btn-primary" disabled={isSubmitting}>{ isSubmitting ? 'Sending...' : 'Post Comment' }</button>
									</div>
								</form>
							</div>
						</section>
					</div>

					<div className="col-lg-4">
						<Sidebar />
					</div>
				</div>
			</div>
		</>
	);
};

export default Single;
