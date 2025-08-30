import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "./../../../api/axios";
import DOMPurify from "dompurify";
import Spinner from "./../../../components/Spinner";
import Breadcrumb from "./../../../components/dashboard/Breadcrumb";

const Single = () => {
	const [post, setPost] = useState({});
	const [posts, setPosts] = useState([]);
	// const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);
	// const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(true);

	const location = useLocation();
	const seotitle = location.pathname.split('/')[3];

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
			    const res = await api.get(`/posts/${seotitle}`);
			    setPost(res.data);
		    } catch(err) {
				setError(err.message);
				setLoading(true);
		    } finally {
				setLoading(false);
		    }
		};
		fetchPost();
	},[seotitle]);

	/*
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
			    const res = await api.get('/categories');
			    setCategories(res.data);
		    } catch(err) {
				setError(err.message);
				setLoading(true);
		    } finally {
				setLoading(false);
		    }
		}
		fetchCategories();
	}, []);
	*/

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
			    const res = await api.get('/posts');
			    setPosts(res.data);
		    } catch(err) {
				setError(err.message);
				setLoading(true);
		    } finally {
				setLoading(false);
		    }
		};
		fetchPosts();
	},[]);

	const { ctitle, ptitle, ppicture, content, tag, pcreated_at, username } = post;

	const currentIndex = posts.filter((val, idx) => {
		let idxValue;
		// eslint-disable-next-line
		if(val.pseotitle.indexOf(`${seotitle}`) == 0 || val.pseotitle == seotitle) {
			idxValue = idx || val.pid;
		}
		return idxValue;
	});

	const getPreviousPost = (array, index) => {
		return array[index - 2];
	}

	const getNextPost = (array, index) => {
		return array[index];
	}

	const previousPost = getPreviousPost(posts, currentIndex[0]?.pid);
	const nextPost = getNextPost(posts, currentIndex[0]?.pid);
	const arrayTag = tag?.split(',');
	const newTag = arrayTag?.map((t, i) => (
        <li key={i}>
			<Link to={`/tag/${t}`}>{t}</Link>
		</li>
	));

	if(loading) return <Spinner />
	if(error) return <p>{error.message}</p>
	if(!post) return (
		<div className="container-fluid">
			<h3 className="text-center">No post found with seotitle {seotitle}</h3>
		</div>
	)

	return (
		<main className="main">
	  		<Breadcrumb />
	  		<section id="starter-section" className="starter-section section">
				<div className="container-fluid">

					<div className="row">
						<div className="col-lg-8">

							<section id="blog-details" className="blog-details section">
						        <div className="container-fluid">

		    						<Link to="/dashboard/posts" className="my-3 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>

						            <article className="article">
						                <div className="post-img">
											<img className="card-img-top" src={ post.ppicture === 'default-150x150.png' ? `${window.location.origin}/img/default-150x150.png` : `../../upload/${ppicture}`} alt="" />
						                </div>
						                <h2 className="title">{ptitle}</h2>
						                <div className="meta-top">
						                    <ul>
						                        <li className="d-flex align-items-center"><i className="bi bi-person"></i> <Link to="blog-details">{username ? `${username[0].toUpperCase()+username.slice(1)}` : null}</Link></li>
						                        <li className="d-flex align-items-center"><i className="bi bi-clock"></i> <Link to="blog-details"><time dateTime={pcreated_at}>{new Date(pcreated_at).toLocaleDateString()}</time></Link></li>
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
										<div className="d-flex justify-content-between mt-3">
											<div>
											{
												previousPost ? (
												<>
													<Link to={`/dashboard/posts/${previousPost['pseotitle']}`}>Previous Post</Link>
													<br />
													<div className="text-wrap" style={{ width: '20rem' }}>
														<p>{previousPost['ptitle']}</p>
													</div>
												</>
												) : null
											}
											</div>

											<div>
											{
												nextPost ? (
												<>
													<Link className="float-end" to={`/dashboard/posts/${nextPost['pseotitle']}`}>Next Post</Link>
													<br />
													<div className="text-wrap" style={{ width: '20rem' }}>
														<p className="text-end">{nextPost['ptitle']}</p>
													</div>
												</>
												) : null
											}
											</div>
										</div>)
									}
						        </div>
						    </section>

						</div>

					</div>
				</div>
			</section>
		</main>
	);
};

export default Single;
