import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import Pagination from "./../components/BlogPager";
// import Sidebar from "./../components/Sidebar";
import Spinner from "./../components/Spinner";

const News = () => {
	const [news, setNews] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		const fetchnews = async () => {
			try {
				// const res = await axios.get(`${process.env.REACT_APP_PROXY}/api/news`);
				const res = await axios.get('/api/news');
				setError(false);
				setLoading(false);
		        setNews(res.data.data);
	        } catch(err) {
				console.error(err);
	        }
		};
		fetchnews();
	}, [news]);

	const pageSize = 6;
	const [currentPage, setCurrentPage ] = useState(1);
	const currentEntryData = useMemo(() => {
		const firstPageIndex = (currentPage -1) * pageSize;
		const lastPageIndex = firstPageIndex + pageSize;
		return news.slice(firstPageIndex, lastPageIndex);
	}, [news, currentPage, pageSize]);

	if(loading) return <Spinner />
	if(error) return <p>{error}</p>

	if(!currentEntryData || currentEntryData.length < 0) {
		return (
			<div className="container py-5">
				<h3 className="text-center">No News Are Available</h3>
			</div>
		)
	} else {
		return (
			<>
			<div className="page-title light-background">
			    <div className="container">
			        <nav className="breadcrumbs">
			            <ol>
			                <li><Link to="/">Home</Link></li>
			                <li>News</li>
			            </ol>
			        </nav>
			        <h1>News</h1>
			    </div>
			</div>

				<div className="container">
					<div className="row">	

						<div className="col-lg-8">
							<Link to="/news/create" className="text-white mt-3 btn btn-primary"><i className="bi bi-pencil"></i> Create News</Link>
							<section id="blog-news" className="blog-news section">
								<div className="container-fluid">
									<div className="row gy-4">
										{
											currentEntryData.map((nn, idx) => (
												<div key={idx} className="col-md-6">
													<article>

														<h3 className="title">{nn.title}</h3>
														<div className="read-more">
															<Link to={`/news/${nn.slug}`}>Read More</Link>
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
										totalCount={news.length}
										onPageChange={(page) => setCurrentPage(page)}
									/>
								</div>
							</section>
						</div>

						<div className="col-lg-4">
							{/* <Sidebar /> */}
						</div>

					</div>			
				</div>
			</>
		)
	}
};

export default News;
