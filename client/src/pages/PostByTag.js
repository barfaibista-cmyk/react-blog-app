import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import Pagination from "./../components/BlogPager";
import Sidebar from "./../components/Sidebar";
import Spinner from "./../components/Spinner";

const PostByTag = () => {
	const [posts, setPosts] = useState([]);
	const [isError, setIsError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const tag = location.pathname.split('/')[2];

	useEffect(() => {
		const fetchPosts = async () => {
		try {
				const res = await axios.get(`/api/post/${tag}/tag`);
				setIsError(false);
				setIsLoading(false);
		        setPosts(res.data);
	        } catch(err) {
				console.error(err);
				setIsError(true);
				setIsLoading(true);
	        }
		};
		fetchPosts();

		return () => {
			document.body.classList.remove('login-page');
			document.body.classList.remove('bg-body-secondary');
		}
	}, [posts, tag]);

	const pageSize = 6;
	const [currentPage, setCurrentPage ] = useState(1);
	const currentEntryData = useMemo(() => {
		const firstPageIndex = (currentPage -1) * pageSize;
		const lastPageIndex = firstPageIndex + pageSize;
		return posts.slice(firstPageIndex, lastPageIndex);
	}, [posts, currentPage, pageSize]);

	const getText = (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html")
		return doc.body.textContent
	}

	if(isError) {
		return (
			<div className="container py-5">
				<h3 className="text-center">No posts found with tag "{decodeURIComponent(tag)}"</h3>
				<p className="text-center">
					<Link to="/">Back to Home</Link>
				</p>
			</div>
		)
	}

	if(isLoading) return <Spinner />

	return (
		<>
			<div className="page-title light-background">
			    <div className="container">
			        <nav className="breadcrumbs">
			            <ol>
			                <li><Link to="/">Home</Link></li>
			                <li>Tag</li>
			                <li className="current">{decodeURIComponent(tag)}</li>
			            </ol>
			        </nav>
			        <h1>{decodeURIComponent(tag)}</h1>
			    </div>
			</div>

			<div className="container pt-5">
				<p className="text-center">Search result for tag <strong>"{decodeURIComponent(tag)}"</strong></p>
				<p className="text-center">Total results <strong>"{posts.length}"</strong> post(s)</p>
			</div>

			<div className="container">
				<div className="row">

					<div className="col-lg-8">
						<section id="blog-posts" className="blog-posts section">
							<div className="container">
								<div className="row gy-4">
									{
										currentEntryData.map((post, idx) => (
											<div key={idx} className="col-md-6">
												<article>
													<div className="post-img">
														<img className="card-img-top" src={ post.ppicture === 'default-150x150.png' || post.ppicture === '' ? `${process.env.REACT_APP_PUBLIC_URL}/img/${post.ppicture}` : `../upload/${post.ppicture}` } alt="" />
													</div>
													<h3 className="title">{post.ptitle}</h3>
													<div className="meta-top">
														<ul>
															<li><i className="bi bi-calendar"></i> {new Date(post.pcreated_at).toLocaleDateString()}</li>
															<li><i className="bi bi-person-fill"></i> {post.username ? `${post.username[0].toUpperCase()+post.username.slice('1')}` : null}</li>
															<li><i className="bi bi-tag-fill"></i> {post.ctitle}</li>
														</ul>
													</div>
													<div className="content">
														<p style={{ textAlign: 'justify' }}>{getText(post.content.slice(0,160))}</p>
													</div>
													<div className="read-more">
														<Link to={`/posts/${post.pseotitle}`}>Read More</Link>
													</div>
												</article>
											</div>
										))
									}
								</div>
							</div>
						</section>

						<section id="blog-pagination" className="blog-pagination section">
							<div className="container">
								<Pagination
									className="d-flex justify-content-center"
									currentPage={currentPage}
									pageSize={pageSize}
									totalCount={posts.length}
									onPageChange={(page) => setCurrentPage(page)}
								/>
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

export default PostByTag;
