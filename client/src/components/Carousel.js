import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await axios.get('/api/posts');
				setPosts(res.data);
			} catch(err) {
				setError(err);
				console.log(err);
			} finally {
				setLoading(false);
			}
		}
		fetchPosts();
	},[posts])

    const handlePrevClick = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
    };

    const handleNextClick = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length);
    };

	const getText = (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html")
		return doc.body.textContent
	}

	if(loading) return <Spinner />
	if(error) return <p>{error.message}</p>
	if(!posts) return <div className="container">
		<p className="text-center">No posts are found</p>
	</div>

   return (
        <div id="carouselExanpleAutoplaying" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {
	                posts.slice(0,6).map((post, index) => (
		                <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
							<img className="img-fluid" src={ post.picture === 'default-150x150.png' ? `${process.env.REACT_APP_PROXY}/api/images/default-150x150.png` : `${process.env.REACT_APP_PROXY}/api/images/blog/${post.picture}`} alt={post.picture_description} />

		                    <div className="bg-dark p-4 carousel-caption d-none d-md-block">
						        <h5 className="text-white">{post.title}</h5>
								<div className="d-flex justify-content-between">
									<div>
										<i className="bi bi-tag-fill"></i>{' '}<small>{post.ctitle}</small>
									</div>
									<div>
										<i className="bi bi-calendar"></i>{' '}<small>{new Date(post.created_at).toLocaleDateString()}</small>
									</div>
									<div>
										<i className="bi bi-person"></i>{' '}<small>{post.username}</small>
									</div>
								</div>
						        <p>{getText(post.content.slice(0,250))}</p>
						      </div>
		                </div>
	                ))
                }
            </div>

            <button className="carousel-control-prev" type="button" onClick={handlePrevClick} data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                <span className="carousel-control-prev-icon bg-dark p-4" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" onClick={handleNextClick} data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                <span className="carousel-control-next-icon bg-dark p-4" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>

            <div className="carousel-indicators p-3">
                {
	                posts.slice(0,6).map((post, index) => (
		                <button
		                    key={index}
		                    type="button"
		                    data-bs-target="#carouselExanpleAutoplaying"
		                    data-bs-slide-to={index}
		                    className={` ${index === activeIndex ? 'active' : ''}`}
		                    aria-current={index === activeIndex ? 'true' : 'false'}
		                    aria-label={`post ${index + 1}`}
		                    onClick={()=> setActiveIndex(index)}
						></button>
	                ))
                }
            </div>
        </div>
    );
};

export default Carousel;
