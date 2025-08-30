import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const CreateNews = () => {
	const [ title, setTitle ] = useState('');
	const [ body, setBody ] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// axios.post(`${process.env.REACT_APP_PROXY}/api/news/insert`, { title, body })
		// .then(res => console.log(res));

		axios.post('/api/news/insert', { title, body })
		.then(res => console.log(res));
	}

	return (
		<>
			<div className="page-title light-background">
			    <div className="container">
			        <nav className="breadcrumbs">
			            <ol>
			                <li><Link to="/">Home</Link></li>
			                <li><Link to="/news">News</Link></li>
			                <li className="current">Create News</li>
			            </ol>
			        </nav>
			        <h1>Create News</h1>
			    </div>
			</div>

			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<Link to="/news" className="text-white mt-3 btn btn-primary"><i className="bi bi-arrow-left"></i> Go Back</Link>
						<section id="blog-details" className="blog-details section">
					        <div className="container">
								<form onSubmit={handleSubmit}>
									<div className="form-group mb-3">
										<label className="form-label" htmlFor="title">Title</label>
										<input type="text" id="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
									</div>
									<div className="form-group mb-3">
										<label className="form-label" htmlFor="body">Body</label>
										<textarea id="body" className="form-control" value={body} onChange={(e) => setBody(e.target.value)} />
									</div>
									<button type="submit" className="btn btn-sm btn-success"><i className="bi bi-save"></i> Create</button>
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

export default CreateNews;
