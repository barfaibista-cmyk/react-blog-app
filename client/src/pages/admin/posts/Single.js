import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import Spinner from "./../../../components/Spinner";
import Breadcrumb from "./../../../components/dashboard/Breadcrumb";
import { useAuth } from './../../../contexts/AuthContext';

const Single = () => {
	const { hasPermission } = useAuth();
	const [post, setPost] = useState({});
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const location = useLocation();
	const seotitle = location.pathname.split('/')[3];

	useEffect(() => {
		const fetchPost = async () => {
			try {
			    const res = await axios.get(`/api/posts/${seotitle}`);
			    setPost(res.data);
		    } catch(err) {
				setError(err.message);
		    } finally {
				setLoading(false);
		    }
		};
		fetchPost();
	},[seotitle]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
			    const res = await axios.get('/api/posts');
			    setPosts(res.data);
		    } catch(err) {
				setError(err.message);
		    } finally {
				setLoading(false);
		    }
		};
		fetchPosts();
	},[]);

	const { ctitle, title, picture, picture_description, content, tag, created_at, username } = post;

    const postIndex = posts.findIndex(post => post.seotitle === seotitle);
    const previousPost = postIndex > 0 ? posts[postIndex - 1] : null;
    const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

	const arrayTag = tag?.split(',');
	const newTag = arrayTag?.map((t, i) => (
        <li key={i}>
			<Link to={`/tag/${t}`}>{t}</Link>
		</li>
	));

	if(loading) return <Spinner />
	if(error) return (
		<div className="container">
			<div className="alert alert-danger" role="alert">
				<h3 className="text-center">{error}</h3>
			</div>
		</div>
	)
	if(!post) return (
		<div className="container">
			<div className="alert alert-danger" role="alert">
				<h3 className="text-center">No post found with seotitle {seotitle}</h3>
			</div>
		</div>
	)
	if(hasPermission('read-posts')) {
		return (
			<main className="main">
		  		<Breadcrumb />
		  		<section id="starter-section" className="starter-section section">
					<div className="container-fluid">

			            <article className="article">
							<Link to="/dashboard/posts" className="mb-5 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>

			                <div className="post-img">
								<img className="card-fluid" src={ post.picture === 'default-150x150.png' ? `${process.env.REACT_APP_PROXY}/api/images/default-150x150.png` : `${process.env.REACT_APP_PROXY}/api/images/blog/${picture}`} alt={picture_description} />
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

						{
							posts && (
							<div className="d-flex justify-content-between mt-3 px-3">
								<div>
								{
									previousPost ? (
									<>
										<Link to={`/dashboard/posts/${previousPost['seotitle']}`}>Previous Post</Link>
										<br />
										<div className="text-wrap" style={{ width: '20rem' }}>
											<p>{previousPost['title']}</p>
										</div>
									</>
									) : null
								}
								</div>

								<div>
								{
									nextPost ? (
									<>
										<Link className="float-end" to={`/dashboard/posts/${nextPost['seotitle']}`}>Next Post</Link>
										<br />
										<div className="text-wrap" style={{ width: '20rem' }}>
											<p className="text-end">{nextPost['title']}</p>
										</div>
									</>
									) : null
								}
								</div>
							</div>)
						}

			        </div>
			    </section>
			</main>
		)
	} else {
		return <Navigate to="/unauthorized" replace={true} />
	}
};

export default Single;
