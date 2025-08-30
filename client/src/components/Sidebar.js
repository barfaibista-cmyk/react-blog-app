import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const AboutMe = (props) => {
	return (
	    <div className="blog-author-widget widget-item">
	        <div className="d-flex flex-column align-items-center">
	            <div className="d-flex align-items-center w-100">
	                <img src={props.author_photo} className="rounded-circle flex-shrink-0" alt="" />
	                <div>
	                    <h4>{props.author_name}</h4>
	                    <div className="social-links">
	                        <Link to="https://x.com/#"><i className="bi bi-twitter-x"></i></Link>
	                        <Link to="https://facebook.com/#"><i className="bi bi-facebook"></i></Link>
	                        <Link to="https://instagram.com/#"><i className="biu bi-instagram"></i></Link>
	                        <Link to="https://instagram.com/#"><i className="biu bi-linkedin"></i></Link>
	                    </div>
	                </div>
	            </div>
	            <p>{props.author_details}</p>
	        </div>
	    </div>
	)
}

const PopularPosts = (props) => {
	return (
        <div className="post-item">
            <h4><Link to={props.detail}>{props.title} ( {props.hits} <i className="bi bi-eye"></i> )</Link></h4>
            <time dateTime={props.date}><i className="bi bi-calendar"></i> {new Date(props.date).toLocaleDateString()}</time>
        </div>
	)
}

const Categories = (props) => {
	return (
		<li>
			<Link to={`/category/${props.title}`}>{props.title}</Link>
		</li>
	)
}

const Sidebar = () => {
	const [categories, setCategories] = useState([]);
	const [popularposts, setPopularposts] = useState([]);
	const [isError, setIsError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [keyword, setKeyword] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await axios.get('/api/categories');
				setCategories(res.data);
			} catch(err) {
				setIsError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCategories();
	},[]);

	useEffect(() => {
		const fetchPopularposts = async () => {
			try {
				const res = await axios.get('/api/posts/hits');
				setPopularposts(res.data);
			} catch(err) {
				setIsError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchPopularposts();
	},[]);

	const handleSearch = (e) => {
		e.preventDefault();
		navigate(`/results?keyword=${keyword}`)
	}

	if(isLoading) return <Spinner />
	if(isError) return <p>Error: {isError.message}</p>
	if(!popularposts && !categories) return <p>No data to display</p>

	return (
		<div className="widgets-container">
			<AboutMe
				author_photo={`${window.location.origin}/img/user2-160x160.jpg`}
				author_name="Mei Giyanto"
				author_details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis est illo officia nobis sapiente id in quod magnam amet sed architecto, ullam laborum dicta quasi voluptates expedita, atque?  Molestias dolorem asperiores ipsa voluptatum, vitae quisquam, saepe explicabo voluptates culpa. Tempore quas sequi rerum atque illo iusto, tempora necessitatibus quae nostrum."
			/>

		    <div className="search-widget widget-item">
		        <h3 className="widget-title">Search</h3>
		        <form onSubmit={handleSearch}>
		            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
		            <button type="button" title="Search">
		                <i className="bi bi-search"></i>
		            </button>
		        </form>
		    </div>

		    {
				popularposts && (
				    <div className="recent-posts-widget widget-item">
						<h3 className="widget-title">Popular Posts</h3>
						{
							popularposts.map((post, idx) => (
								<PopularPosts
									key={idx}
									detail={`/posts/${post.seotitle}`}
									title={post.title}
									date={post.created_at}
									hits={post.hits}
								/>
							))
						}
				    </div>
				)
			}

			{
				categories && (
					<div className="tags-widget widget-item">
				        <h3 className="widget-title">Categories</h3>
				        <ul>
							{
								categories.map((category, idx) => (
									<Categories key={idx} title={category.title} />
								))
							}
						</ul>
					</div>
				)
			}

		</div>
	);
}

export default Sidebar;
