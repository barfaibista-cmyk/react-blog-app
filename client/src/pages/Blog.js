import axios from 'axios';
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "./../components/BlogPager";
import Sidebar from "./../components/Sidebar";
import Spinner from "./../components/Spinner";

const Blog = () => {
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await axios.get('/api/posts');
		        setPosts(res.data);
	        } catch(err) {
				console.error(err);
				setError(err.message);
	        } finally {
				setLoading(false);
	        }
		};
		fetchPosts();
	}, []);

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

	if(loading) return <Spinner />
	if(error) return <p>{error}</p>

	if(!currentEntryData || currentEntryData.length < 0) {
		return (
			<div className="container py-5">
				<h3 className="text-center">No Posts Are Available</h3>
			</div>
		)
	} else {
		return (
			<>
				<div className="container">
					<div className="row">

						<div className="col-lg-9">
							<section id="blog-posts" className="blog-posts section">
								<div className="container-fluid">
									<div className="row gy-4">
										{
											currentEntryData.map((post, idx) => (
												<div key={idx} className="col-md-6">
													<article>
														<div className="post-img">
															<img className="img-fluid" src={ post.picture === 'default-150x150.png' ? `${process.env.REACT_APP_PROXY}/api/images/default-150x150.png` : `${process.env.REACT_APP_PROXY}/api/images/blog/${post.picture}`} alt={post.picture_description} />
														</div>
														<h3 className="title">{post.title}</h3>
														<div className="meta-top">
															<ul>
																<li><i className="bi bi-calendar"></i> {new Date(post.created_at).toLocaleDateString()}</li>
																<li><i className="bi bi-person-fill"></i> {post.username && `${post.username[0].toUpperCase()+post.username.slice('1')}`}</li>
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

						<div className="col-lg-3">
							<Sidebar />
						</div>

					</div>
				</div>
			</>
		)
	}
};

export default Blog;
