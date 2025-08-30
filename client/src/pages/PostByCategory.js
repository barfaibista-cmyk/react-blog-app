import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import Pagination from "./../components/BlogPager";
import Sidebar from "./../components/Sidebar";
import Spinner from "./../components/Spinner";

const PostByCategory = () => {
	const [posts, setPosts] = useState([]);
	const [isError, setIsError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();
	const category = location.pathname.split('/')[2];

	useEffect(() => {
		const fetchPosts = async () => {
		try {
				const res = await axios.get(`/api/posts/${category}/category`);
		        setPosts(res.data);
	        } catch(err) {
				setIsError(err.message);
				setIsLoading(true);
	        } finally {
				setIsLoading(false);
	        }
		};
		fetchPosts();

 	}, [posts, category]);

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

	if(isLoading) return <Spinner />
	if(isError) {
		<div className="alert alert-danger" role="alert">{isError.message}</div>
	}
	if(!posts) {
		return (
			<div className="container py-5">
				<h3 className="text-center">No posts found with category "{decodeURIComponent(category)}"</h3>
				<p className="text-center">
					<Link to="/">Back to Home</Link>
				</p>
			</div>
		)
	}

	return (
		<>
			<div className="page-title light-background">
			    <div className="container">
			        <nav className="breadcrumbs">
			            <ol>
			                <li><Link to="/">Home</Link></li>
			                <li>Category</li>
			                <li className="current">{decodeURIComponent(category)}</li>
			            </ol>
			        </nav>
			        <h1>{decodeURIComponent(category)}</h1>
			    </div>
			</div>

			<div className="container pt-5">
				<p className="text-center">Search result for category <strong>"{decodeURIComponent(category)}"</strong></p>
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
														<img className="card-img-top" src={ post.picture === 'default-150x150.png' ? `${process.env.REACT_APP_PROXY}/api/images/upload/default-150x150.png` : `${process.env.REACT_APP_PROXY}/api/images/blog/${post.picture}`} alt={post.picture_description} />
													</div>
													<h3 className="title">{post.title}</h3>
													<div className="meta-top">
														<ul>
															<li><i className="bi bi-calendar"></i> {new Date(post.created_at).toLocaleDateString()}</li>
															<li><i className="bi bi-person-fill"></i> {post.username ? `${post.username[0].toUpperCase()+post.username.slice('1')}` : null}</li>
															<li><i className="bi bi-tag-fill"></i> {post.ctitle}</li>
														</ul>
													</div>
													<div className="content">
														<p style={{ textAlign: 'justify' }}>{getText(post.content.slice(0,160))}</p>
													</div>
													<div className="read-more">
														<Link to={`/posts/${post.seotitle}`}>Read More</Link>
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

export default PostByCategory;
