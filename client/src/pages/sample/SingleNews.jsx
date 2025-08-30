import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";

const SingleNews = () => {
	const [ news, setNews ] = useState({});
	const [ error, setError ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(true);

	const location = useLocation();
	const slug = location.pathname.split('/')[2];
	
	useEffect(() => {
		const fetchNews = async () => {
			try {
			    const res = await axios.get(`${process.env.REACT_APP_PROXY}/api/news/show/${slug}`);
			    setNews(res.data);
				setError(false);
				setIsLoading(false);
			} catch(err) {
				setError(err);
				console.error(err);
			}
		};
		fetchNews();
	},[slug]);

	if(error) return <p>{error}</p>
	if(isLoading) return <Spinner />
	if(!news) return <div className="container py-5">
			<h3 className="text-center">No News Found</h3>
		</div>

	return (
		<>
			<div className="page-title light-background">
			    <div className="container">
			        <nav className="breadcrumbs">
			            <ol>
			                <li><Link to="/">Home</Link></li>
			                <li><Link to="/news">News</Link></li>
			                <li className="current">{news[0]['title']}</li>
			            </ol>
			        </nav>
			        <h1>{news[0]['title']}</h1>
			    </div>
			</div>

			<div className="container">
				<div className="row">
					<div className="col-lg-8">

						<section id="blog-details" className="blog-details section">
					        <div className="container">

					            <article key={news[0]['id']} className="article">

					                <h2 className="title">{news[0]['title']}</h2>
			                
					                <div className="content">
									    <p style={{ textAlign: 'justify' }}
									      dangerouslySetInnerHTML={{
									        __html: DOMPurify.sanitize(news[0]['body'])
								        }}
									    ></p>
					                </div>
					                

					            </article>

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

export default SingleNews;
