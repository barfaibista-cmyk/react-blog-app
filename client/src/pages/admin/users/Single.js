import axios from 'axios';
import { useEffect, useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import Spinner from "./../../../components/Spinner";
import Breadcrumb from "./../../../components/dashboard/Breadcrumb";
import { useAuth } from './../../../contexts/AuthContext';

const Single = () => {
	const { hasPermission } = useAuth();
	const [user, setUser] = useState({});
	const [permissions, setPermissions] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const id = location.pathname.split('/')[3];

    const fetchAllData = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const [userResp, permissionsResp] = await Promise.all([
                axios.get(`/api/users/${id}`),
                axios.get(`/api/rolepermissions/${id}`)
            ]);
            setUser(userResp.data || {});
            setPermissions(permissionsResp.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to fetch user and permissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData(id);
    }, [id]);

	if(loading) return <Spinner />
	if(error) return (
		<div className="container p-5 text-center">
			<div className="alert alert-danger" role="alert">{error}</div>
		</div>
	)

	if(hasPermission('read-users')) {
		return (
			<main className="main">
		  		<Breadcrumb />
		  		<section id="starter-section" className="starter-section section">
					<div className="container-fluid">

			            <article className="article">

							<Link to="/dashboard/users" className="mb-3 text-white btn btn-primary"><i className="bi bi-arrow-left"></i> Go back</Link>

							<div className="container-fluid mt-3">

					    		{error && (
									<div className="alert alert-danger" role="alert">{error}</div>
					    		)}

				    			<div className="row">
				            		<div className="col-md-9">
						            	<table className="table table-striped table-bordered">
						            		<tbody>
							            		<tr>
							            			<th>Full Name</th>
							            			<td>{user.name}</td>
							            		</tr>
							            		<tr>
							            			<th>Username</th>
							            			<td>{user.username}</td>
							            		</tr>
							            		<tr>
							            			<th>Email</th>
							            			<td>{user.email}</td>
							            		</tr>
							            		<tr>
							            			<th>Bio</th>
							            			<td>{user.bio}</td>
							            		</tr>
							            		<tr>
							            			<th>Telp</th>
							            			<td>{user.telp}</td>
							            		</tr>
							            		<tr>
							            			<th>Created At</th>
							            			<td>{new Date(user.created_at).toLocaleDateString()}</td>
							            		</tr>
						            		</tbody>
						            	</table>
				            		</div>
				            		<div className="col-md-3">
				            			<img className="img-fluid" src={user.picture === 'avatar.png' ? `${process.env.REACT_APP_PROXY}/api/images/avatar.png` : `${process.env.REACT_APP_PROXY}/api/images/${user.picture}`} alt="" />
				            		</div>          		
				            	</div>
			            	</div>

							<div className="container-fluid mt-3">
							{
								permissions[user.username] ? (
									<>
										<h3 className="text-center">Current Permissions</h3>
						            	<div className="row mt-4">
											{
												permissions[user.username]?.map((permission, idx) => (
													<>
						            					<div className="col-md-3">
															<p>[{idx+1}] {permission}</p>
														</div>
														{ (idx+1) % 4 === 0 ? (<hr/>) : (null) }
													</>
												))
											}
										</div>
									</>
								) : (
									<h3 className="text-center">No permisions are available for this users</h3>
								)
							}
							</div>

			            </article>

					</div>
				</section>
			</main>
		)
	} else {
		return <Navigate to="/unauthorized" replace={true} />
	}
};

export default Single;
